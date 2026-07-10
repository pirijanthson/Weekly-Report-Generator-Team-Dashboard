from fastapi import APIRouter, Depends

from app.schemas.report_schema import WeeklyReportCreate
from app.services.report_service import create_report, get_reports, update_report, submit_report, delete_report
from app.core.auth import get_current_user

router = APIRouter(
    prefix="/reports",
    tags=["Weekly Reports"]
)


@router.post("/create")
def create_weekly_report(
    report: WeeklyReportCreate,
    current_user=Depends(get_current_user)
):
    return create_report(report, current_user)

@router.get("/view")
def view_my_reports(
    current_user=Depends(get_current_user)
):
    return get_reports(current_user)

@router.put("/{report_id}")
def edit_report(
    report_id: str,
    report: WeeklyReportCreate,
    current_user=Depends(get_current_user)
):
    return update_report(
        report_id,
        report,
        current_user
    )

@router.post("/{report_id}/submit")
def submit_weekly_report(
    report_id: str,
    current_user=Depends(get_current_user)
):
    return submit_report(
        report_id,
        current_user
    )

@router.delete("/{report_id}")
def delete_weekly_report(
    report_id: str,
    current_user=Depends(get_current_user)
):
    return delete_report(
        report_id,
        current_user
    )