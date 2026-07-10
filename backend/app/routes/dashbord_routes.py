from fastapi import APIRouter, Depends, Query

from app.core.admin_auth import get_current_admin
from app.services.report_service import get_all_reports, get_report_status_summary
from app.services.dashboard_service import get_dashboard_summary, get_tasks_completed_trend, get_member_report_status, get_project_workload, get_recent_activity


router = APIRouter(
    prefix="/dashboard",
    tags=["Team Dashboard"]
)


@router.get("/reports")
def view_team_reports(
    week: str = Query(None),
    email: str = Query(None),
    project: str = Query(None),
    start_date: str = Query(None),
    end_date: str = Query(None),
    admin=Depends(get_current_admin)
):

    reports = get_all_reports(
        week,
        email,
        project,
        start_date,
        end_date
    )

    status_summary = get_report_status_summary()


    return {
        "success": True,
        "total_reports": len(reports),
        "status_summary": status_summary,
        "reports": reports
    }

@router.get("/summary")
def dashboard_summary(
    admin=Depends(get_current_admin)
):

    return {
        "success": True,
        "data": get_dashboard_summary()
    }

@router.get("/task-trend")
def task_completed_trend(
    admin=Depends(get_current_admin)
):

    return {
        "success": True,
        "data": get_tasks_completed_trend()
    }

@router.get("/member-status")
def member_report_status(
    admin=Depends(get_current_admin)
):

    return {
        "success": True,
        "data": get_member_report_status()
    }

@router.get("/project-workload")
def project_workload(
    admin=Depends(get_current_admin)
):

    return {
        "success": True,
        "data": get_project_workload()
    }

@router.get("/activity")
def recent_activity(
    admin=Depends(get_current_admin)
):

    return {
        "success": True,
        "activities": get_recent_activity()
    }