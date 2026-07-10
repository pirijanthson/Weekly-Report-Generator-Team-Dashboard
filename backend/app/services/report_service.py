from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.config.database import get_database
from bson import ObjectId


db = get_database()


# Create Weekly Report
def create_report(report, current_user):

    # Check if report already exists for same week and project
    existing_report = db.weekly_reports.find_one(
        {
            "user_id": str(current_user["_id"]),
            "week_start": str(report.week_start),
            "week_end": str(report.week_end),
            "project": report.project
        }
    )


    if existing_report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already created a report for this project and week."
        )


    report_data = {

        "user_id": str(current_user["_id"]),

        "full_name": current_user["full_name"],

        "email": current_user["email"],


        "week_start": str(report.week_start),

        "week_end": str(report.week_end),


        "project": report.project,


        "tasks_completed": report.tasks_completed,


        "tasks_planned": report.tasks_planned,


        "blockers": report.blockers,


        "hours_worked": report.hours_worked,


        "notes": report.notes,


        "status": "draft",


        "created_at": datetime.now(timezone.utc),

        "updated_at": datetime.now(timezone.utc),

        "submitted_at": None
    }


    result = db.weekly_reports.insert_one(report_data)


    return {

        "success": True,

        "message": "Weekly report created successfully.",

        "report_id": str(result.inserted_id)

    }



# View Own Report History
def get_reports(current_user):

    reports = db.weekly_reports.find(
        {
            "user_id": str(current_user["_id"])
        }
    ).sort(
        "Week_start",
        -1
    )


    weekly_history = {}


    for report in reports:

        week_key = (
            report["week_start"],
            report["week_end"],
            report["project"]
        )

        if week_key not in weekly_history:

            weekly_history[week_key] = []

        weekly_history[week_key].append(

            {

                "id": str(report["_id"]),


                "full_name": report["full_name"],

                "email": report["email"],


                "week_start": report["week_start"],

                "week_end": report["week_end"],


                "project": report["project"],


                "tasks_completed": report["tasks_completed"],


                "tasks_planned": report["tasks_planned"],


                "blockers": report["blockers"],


                "hours_worked": report["hours_worked"],


                "notes": report["notes"],


                "status": report["status"],


                "created_at": report["created_at"],

                "updated_at": report["updated_at"],

                "submitted_at": report["submitted_at"]

            }

        )

    history = []

    for week_key, reports in weekly_history.items():

        history.append(

            {

                "week_start": week_key[0],

                "week_end": week_key[1],

                "project": week_key[2],

                "reports": reports

            }

        )


    return {

        "success": True,

        "count": len(history),

        "reports": history

    }

def update_report(report_id, report, current_user):

    existing_report = db.weekly_reports.find_one(
        {
            "_id": ObjectId(report_id),
            "user_id": str(current_user["_id"])
        }
    )


    if not existing_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found or you do not have permission."
        )


    if existing_report["status"] == "submitted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Submitted reports cannot be edited."
        )


    updated_data = {

        "week_start": str(report.week_start),

        "week_end": str(report.week_end),

        "project": report.project,

        "tasks_completed": report.tasks_completed,

        "tasks_planned": report.tasks_planned,

        "blockers": report.blockers,

        "hours_worked": report.hours_worked,

        "notes": report.notes,

        "updated_at": datetime.now(timezone.utc)

    }


    db.weekly_reports.update_one(

        {
            "_id": ObjectId(report_id),
            "user_id": str(current_user["_id"])
        },

        {
            "$set": updated_data
        }

    )


    return {

        "success": True,

        "message": "Weekly report updated successfully."

    }

def submit_report(report_id, current_user):

    existing_report = db.weekly_reports.find_one(
        {
            "_id": ObjectId(report_id),
            "user_id": str(current_user["_id"])
        }
    )


    if not existing_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found or you do not have permission."
        )


    if existing_report["status"] == "submitted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report has already been submitted."
        )


    db.weekly_reports.update_one(

        {
            "_id": ObjectId(report_id),
            "user_id": str(current_user["_id"])
        },

        {
            "$set": {
                "status": "submitted",
                "submitted_at": datetime.now(timezone.utc)
            }
        }

    )


    return {

        "success": True,

        "message": "Weekly report submitted successfully."

    }

def delete_report(report_id, current_user):

    existing_report = db.weekly_reports.find_one(
        {
            "_id": ObjectId(report_id),
            "user_id": str(current_user["_id"])
        }
    )


    if not existing_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found or you do not have permission."
        )


    if existing_report["status"] == "submitted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Submitted reports cannot be deleted."
        )


    db.weekly_reports.delete_one(
        {
            "_id": ObjectId(report_id),
            "user_id": str(current_user["_id"])
        }
    )


    return {

        "success": True,

        "message": "Weekly report deleted successfully."

    }

def get_all_reports(
    week=None,
    email=None,
    project=None,
    start_date=None,
    end_date=None
):

    query = {}


    # Filter by week
    if week:
        query["week_start"] = week


    # Filter by team member
    if email:
        query["email"] = email


    # Filter by project/category
    if project:
        query["project"] = project


    # Filter by date range
    if start_date and end_date:

        query["week_start"] = {
            "$gte": start_date,
            "$lte": end_date
        }


    reports = db.weekly_reports.find(
        query,
        {
            "_id": 0,
            "user_name": 1,
            "full_name": 1,
            "email": 1,
            "project": 1,
            "week_start": 1,
            "status": 1,
            "submitted_at": 1
        }
    )

    return list(reports)

def get_report_status_summary():

    reports = db.weekly_reports.find(
        {},
        {
            "status": 1
        }
    )


    summary = {
        "submitted": 0,
        "pending": 0,
        "late": 0
    }


    for report in reports:

        status = report.get("status")

        if status in summary:
            summary[status] += 1


    return summary