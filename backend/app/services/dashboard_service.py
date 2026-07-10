from datetime import datetime, timedelta

from app.config.database import get_database


db = get_database()


def get_dashboard_summary():

    today = datetime.now()

    start_week = today - timedelta(
        days=today.weekday()
    )


    start_week = start_week.strftime(
        "%Y-%m-%d"
    )


    # Reports submitted this week

    total_reports = db.weekly_reports.count_documents(
        {
            "week_start": {
                "$gte": start_week
            }
        }
    )


    submitted_reports = db.weekly_reports.count_documents(
        {
            "week_start": {
                "$gte": start_week
            },
            "status": "submitted"
        }
    )


    pending_reports = db.weekly_reports.count_documents(
        {
            "week_start": {
                "$gte": start_week
            },
            "status": "pending"
        }
    )


    # Blockers count

    open_blockers = db.weekly_reports.count_documents(
        {
            "blockers": {
                "$exists": True,
                "$ne": ""
            }
        }
    )


    compliance_rate = 0


    if total_reports > 0:

        compliance_rate = round(
            (submitted_reports / total_reports) * 100,
            2
        )


    return {

        "total_reports_this_week": total_reports,

        "submission_compliance_rate": f"{compliance_rate}%",

        "submitted_reports": submitted_reports,

        "pending_reports": pending_reports,

        "open_blockers": open_blockers

    }

def get_tasks_completed_trend():

    reports = db.weekly_reports.find(
        {},
        {
            "_id": 0,
            "week_start": 1,
            "tasks_completed": 1
        }
    )


    trend = {}


    for report in reports:

        date = report.get("week_start")


        tasks = report.get(
            "tasks_completed",
            []
        )


        task_count = len(tasks)


        if date in trend:

            trend[date] += task_count

        else:

            trend[date] = task_count



    result = []


    for date, count in trend.items():

        result.append(
            {
                "date": date,
                "tasks_completed": count
            }
        )


    return result

def get_member_report_status():

    reports = db.weekly_reports.find(
        {},
        {
            "_id": 0,
            "full_name": 1,
            "status": 1
        }
    )


    members = {}


    for report in reports:

        name = report.get(
            "full_name",
            "Unknown"
        )

        status = report.get(
            "status",
            "pending"
        )


        if name not in members:

            members[name] = {
                "name": name,
                "submitted": 0,
                "pending": 0,
                "late": 0
            }


        if status in members[name]:

            members[name][status] += 1


    return list(members.values())

def get_project_workload():

    reports = db.weekly_reports.find(
        {},
        {
            "_id": 0,
            "project": 1,
            "tasks_completed": 1
        }
    )


    projects = {}


    for report in reports:

        project_name = report.get(
            "project",
            "Unknown"
        )


        tasks = report.get(
            "tasks_completed",
            []
        )


        task_count = len(tasks)


        if project_name in projects:

            projects[project_name] += task_count

        else:

            projects[project_name] = task_count



    result = []


    for project, count in projects.items():

        result.append(
            {
                "project": project,
                "total_tasks": count
            }
        )


    return result

def get_recent_activity():

    reports = db.weekly_reports.find(
        {},
        {
            "_id": 0,
            "full_name": 1,
            "email": 1,
            "project": 1,
            "status": 1,
            "submitted_at": 1,
            "updated_at": 1
        }
    ).sort(
        "submitted_at",
        -1
    ).limit(10)


    activities = []


    for report in reports:

        activities.append(
            {
                "user": report.get(
                    "full_name",
                    "Unknown"
                ),

                "email": report.get(
                    "email"
                ),

                "project": report.get(
                    "project"
                ),

                "status": report.get(
                    "status"
                ),

                "submitted_at": report.get(
                    "submitted_at"
                ),

                "updated_at": report.get(
                    "updated_at"
                )
            }
        )


    return activities