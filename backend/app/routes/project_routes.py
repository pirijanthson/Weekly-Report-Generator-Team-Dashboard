from fastapi import APIRouter, Depends

from app.schemas.project_schema import ProjectCreate, ProjectUpdate, AssignMembers
from app.services.project_service import create_project, get_all_projects, update_project, delete_project, assign_members, get_user_projects
from app.core.admin_auth import get_current_admin
from app.core.auth import get_current_user


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.post("/create")
def add_project(
    project: ProjectCreate,
    admin=Depends(get_current_admin)
):

    return create_project(project)

@router.get("/view")
def view_projects(
    admin=Depends(get_current_admin)
):

    projects = get_all_projects()

    return {
        "success": True,
        "total_projects": len(projects),
        "projects": projects
    }

@router.put("/update/{project_id}")
def edit_project(
    project_id: str,
    project: ProjectUpdate,
    admin=Depends(get_current_admin)
):

    return update_project(
        project_id,
        project
    )

@router.delete("/delete/{project_id}")
def remove_project(
    project_id: str,
    admin=Depends(get_current_admin)
):

    return delete_project(project_id)

@router.post("/{project_id}/members")
def add_project_members(
    project_id: str,
    data: AssignMembers,
    admin=Depends(get_current_admin)
):

    return assign_members(
        project_id,
        data.members
    )

@router.get("/my-projects")
def view_my_projects(
    user=Depends(get_current_user)
):

    projects = get_user_projects(
        user["email"]
    )


    return {
        "success": True,
        "total_projects": len(projects),
        "projects": projects
    }
