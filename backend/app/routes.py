from flask import Blueprint, request, jsonify
import json
from pathlib import Path

tasks_bp = Blueprint("tasks", __name__)

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "tasks.json"


def load_tasks():
    with open(DATA_FILE, "r") as file:
        data = json.load(file)
    return data["tasks"]


def save_tasks(tasks):
    with open(DATA_FILE, "w") as file:
        json.dump({"tasks": tasks}, file, indent=2)


@tasks_bp.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = load_tasks()

    return jsonify({
        "success": True,
        "count": len(tasks),
        "tasks": tasks
    })


@tasks_bp.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    priority = data.get("priority", "medium").lower()

    if not title:
        return jsonify({
            "success": False,
            "message": "Task title is required"
        }), 400

    allowed_priorities = {"low", "medium", "high"}

    if priority not in allowed_priorities:
        return jsonify({
            "success": False,
            "message": "Priority must be low, medium or high"
        }), 400

    tasks = load_tasks()

    new_task = {
        "id": len(tasks) + 1,
        "title": title,
        "description": description,
        "priority": priority,
        "status": "todo"
    }

    tasks.append(new_task)
    save_tasks(tasks)

    return jsonify({
        "success": True,
        "message": "Task created successfully",
        "task": new_task
    }), 201
@tasks_bp.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json(silent=True) or {}

    tasks = load_tasks()

    task = next((task for task in tasks if task["id"] == task_id), None)

    if task is None:
        return jsonify({
            "success": False,
            "message": "Task not found"
        }), 404

    if "title" in data:
        title = data["title"].strip()

        if not title:
            return jsonify({
                "success": False,
                "message": "Task title cannot be empty"
            }), 400

        task["title"] = title

    if "description" in data:
        task["description"] = data["description"].strip()

    if "priority" in data:
        priority = data["priority"].lower()

        if priority not in {"low", "medium", "high"}:
            return jsonify({
                "success": False,
                "message": "Priority must be low, medium or high"
            }), 400

        task["priority"] = priority

    if "status" in data:
        status = data["status"].lower()

        if status not in {"todo", "in_progress", "completed"}:
            return jsonify({
                "success": False,
                "message": "Status must be todo, in_progress or completed"
            }), 400

        task["status"] = status

    save_tasks(tasks)

    return jsonify({
        "success": True,
        "message": "Task updated successfully",
        "task": task
    })


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    tasks = load_tasks()

    task = next((task for task in tasks if task["id"] == task_id), None)

    if task is None:
        return jsonify({
            "success": False,
            "message": "Task not found"
        }), 404

    tasks = [task for task in tasks if task["id"] != task_id]

    save_tasks(tasks)

    return jsonify({
        "success": True,
        "message": "Task deleted successfully"
    })
