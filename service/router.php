<?php

require_once("ckBowsRestHandler.php");

if ($_SERVER["REQUEST_URI"] == "/learner/token/" && $_SERVER["REQUEST_METHOD"] === "POST")
{
    $args = json_decode(file_get_contents("php://input"));
    $ckBowsRestHandler = new ckBowsRestHandler();
    return $ckBowsRestHandler->getLearnerToken($args);
}
else
{
    return false;
}
?>