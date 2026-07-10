from datetime import datetime
from app.config.database import get_database
from bson import ObjectId

db = get_database()

def create_project(project):

    data = project.model_dump()

    data["created_at"] = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    db.projects.insert_one(data)

    return {
        "message": "Project created successfully"
    }

def get_all_projects():

    projects = db.projects.find(
        {},
        {
            "_id": 1,
            "name": 1,
            "description": 1,
            "members": 1,
            "created_at": 1,
            "updated_at": 1
        }
    )


    project_list = []


    for project in projects:

        project["id"] = str(
            project["_id"]
        )


        del project["_id"]


        project_list.append(project)



    return project_list

def update_project(project_id, project):

    update_data = {
        key: value
        for key, value in project.model_dump().items()
        if value is not None
    }


    update_data["updated_at"] = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


    result = db.projects.update_one(
        {
            "_id": ObjectId(project_id)
        },
        {
            "$set": update_data
        }
    )


    if result.matched_count == 0:

        return {
            "message": "Project not found"
        }


    return {
        "message": "Project updated successfully"
    }

def delete_project(project_id):

    result = db.projects.delete_one(
        {
            "_id": ObjectId(project_id)
        }
    )


    if result.deleted_count == 0:

        return {
            "message": "Project not found"
        }


    return {
        "message": "Project deleted successfully"
    }

def assign_members(project_id, members):

    result = db.projects.update_one(
        {
            "_id": ObjectId(project_id)
        },
        {
            "$set": {
                "members": members,
                "updated_at": datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
            }
        }
    )


    if result.matched_count == 0:

        return {
            "message": "Project not found"
        }


    return {
        "message": "Team members assigned successfully"
    }

def get_user_projects(email):

    projects = db.projects.find(
        {
            "members": email
        },
        {
            "_id": 0,
            "name": 1,
            "description": 1,
            "members": 1,
            "created_at": 1,
            "updated_at": 1
        }
    )

    project_list = []


    for project in projects:

        if "members" not in project:
            project["members"] = []

        project_list.append(project)


    return project_list