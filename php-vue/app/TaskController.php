<?php

function __autoload($class_name) {
    require_once $class_name . '.php';
}

class TaskController
{
    public $conn;

    public function __construct($db){
      return  $this->conn = $db;

    }

    public function index($conn)
    {
        $res = array('error' => false);

        $task = new Task();
        $tasks = $task->fetchAllTask($conn);

        $res['task'] = $tasks;
        // print json encoded data
        echo json_encode($res);
        die();

    }
    public function create($conn)
    {

        $createTask = new Task();
        $createdTask = $createTask->storeTask($conn);

        // print json encoded data
        echo json_encode($createdTask);
        die();

    }
    public function update($conn)
    {
        $updateTask = new Task();
        $updatedTask = $updateTask->updateTask($conn);

        // print json encoded data
        echo json_encode($updatedTask);
        die();

    }
    public function delete($conn)
    {
        $deleteTask = new Task();
        $deletedTask = $deleteTask->removeTask($conn);

        // print json encoded data
        echo json_encode($deletedTask);
        die();

    }
    public function deleteCompleted($conn)
    {
        $deleteCompleteTask = new Task();
        $deletedCompleteTask = $deleteCompleteTask->removeCompletedTask($conn);

        // print json encoded data
        echo json_encode($deletedCompleteTask);
        die();

    }
    public function updateStatus($conn)
    {
        $updateTaskStatus = new Task();
        $updatedTaskStatus = $updateTaskStatus->updateTaskStatus($conn);

        // print json encoded data
        echo json_encode($updatedTaskStatus);
        die();
    }
}

// get database connection
$database = new Task();
$db = $database->getConnection();


$task = new TaskController($db);

// Read data from database
$action = 'index';

if (isset($_GET['action'])) {
    $action = $_GET['action'];
}

if ($action == 'index') {
    $task->index($db);
}

if ($action == 'create') {
    $task->create($db);
}

if ($action == 'update') {
    $task->update($db);
}

if ($action == 'delete') {
    $task->delete($db);
}
if ($action == 'deleteCompleted') {
    $task->deleteCompleted($db);
}
if ($action == 'updateStatus') {
    $task->updateStatus($db);
}



