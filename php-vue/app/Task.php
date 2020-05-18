<?php

//function __autoload($class_name) {
//    require_once $class_name . '.php';
//}
class Task
{
// specify your own database credentials

    public $conn;
    // get the database connection
    public function getConnection(){

        $this->conn = null;

        try{
            $this->conn = new mysqli("localhost", "root", "", "todo");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
    public function fetchAllTask($conn){

        $result = $conn->query("SELECT * FROM `task`");
        $tasks  = array();

        while ($row = $result->fetch_assoc()) {
            array_push($tasks, $row);
        }

        $conn->close();

        return $tasks;
    }
    public function storeTask($conn){

        $res = array('error' => false);

        $title        = $_POST['title'];

        $result = $conn->query("INSERT INTO `task` (`title`) VALUES('$title')");
        $id = mysqli_insert_id($conn);

        if ($result) {
            $res['message'] = "Task added successfully";
            $res['taskId'] = $id;
        } else {
            $res['error']   = true;
            $res['message'] = "Task insert failed!";
        }
        $conn->close();
        return $res;
    }
    public function updateTask($conn){

        $res = array('error' => false);

        $id           = $_POST['id'];
        $title        = $_POST['title'];
        $completed    = $_POST['completed'];

        $result = $conn->query("UPDATE `task` SET `title`='$title', `completed`='$completed' WHERE `id`='$id'");

        if ($result) {
            $res['message'] = "Task updated successfully";
        } else {
            $res['error']   = true;
            $res['message'] = "Task update failed!";
        }

        $conn->close();

        return $res;
    }
    public function removeTask($conn){

        $res = array('error' => false);

        $id       = $_POST['id'] ;

        $result = $conn->query("DELETE FROM `task` WHERE `id`='$id'");

        if ($result) {
            $res['message'] = "task delete success";
        } else {
            $res['error']   = true;
            $res['message'] = "task delete failed!";
        }

        $conn->close();

        return $res;
    }
    public function removeCompletedTask($conn){

        $res = array('error' => false);

        $completed =  $_POST['completed'];

        $result = $conn->query("DELETE FROM `task` WHERE `completed`='$completed'");

        if ($result) {
            $res['message'] = "task delete success";
        } else {
            $res['error']   = true;
            $res['message'] = "task delete failed!";
        }

        $conn->close();

        return $res;
    }
    public function updateTaskStatus($conn){

        $res = array('error' => false);

        $id           = $_POST['id'];
        $title        = $_POST['title'];
        $completed    = $_POST['completed'];


        if($completed == 'false'){

            $completed = 1;

        }elseif($completed == 'true'){
            $completed = 0;
        }

        $result = $conn->query("UPDATE `task` SET `completed`='$completed' WHERE `id`='$id'");


        if ($result) {
            $res['message'] = "Task updated successfully";
        } else {
            $res['error']   = true;
            $res['message'] = "Task update failed!";
        }

        $conn->close();

        return $res;
    }
}