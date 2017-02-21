<?php

require_once("ckBowsRestHandler.php");

function startsWith($haystack, $needle) {
    // search backwards starting from haystack length characters from the end
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
}

function endsWith($haystack, $needle) {
    // search forward starting from end minus needle length characters
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}

if (endsWith($_SERVER["REQUEST_URI"], "/learner/") && $_SERVER["REQUEST_METHOD"] === "POST")
{
    $args = json_decode(file_get_contents("php://input"));
    $ckBowsRestHandler = new ckBowsRestHandler();
    return $ckBowsRestHandler->getLearner($args);
}
else if (endsWith($_SERVER["REQUEST_URI"], "/learner/token/") && $_SERVER["REQUEST_METHOD"] === "POST")
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