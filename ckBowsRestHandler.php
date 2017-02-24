<?php

/*
	Wrapper for all CKLS web services call
	Author: Julien Chomarat @ Crossknowledge
	Project: https://github.com/CrossKnowledgeIntegration/mobileSmartConnect

	You need to add a file in the same location called app.ini that will contain
		* The CKLS instance URL
		* The CKLS API Key

		CKLS_URL = https://jnstance.crossknowledge.com/API/ADMIN/v1/REST/
		API-KEY = 68e059c32bc50232fc45df4abd6bc5a9

	This software is provided "AS IS" - Licence MIT (https://opensource.org/licenses/MIT)
*/

class ckBowsRestHandler
{
	private $httpVersion = "HTTP/1.1";
	private $ini = null;

	// Retreive configuration file
	function __construct() {
		$this->ini = parse_ini_file('app.ini');
	}

	// Finalize HTTP response with status code and content type
	private function setHttpHeaders($contentType, $statusCode)
	{		
		$statusMessage = $this -> getHttpStatusMessage($statusCode);		
		header($this->httpVersion. " ". $statusCode ." ". $statusMessage);		
		header("Content-Type:". $contentType);
	}
	
	// Wrapper for all HTTP statuses
	private function getHttpStatusMessage($statusCode)
	{
		$httpStatus = array(
			100 => 'Continue',  
			101 => 'Switching Protocols',  
			200 => 'OK',
			201 => 'Created',  
			202 => 'Accepted',  
			203 => 'Non-Authoritative Information',  
			204 => 'No Content',  
			205 => 'Reset Content',  
			206 => 'Partial Content',  
			300 => 'Multiple Choices',  
			301 => 'Moved Permanently',  
			302 => 'Found',  
			303 => 'See Other',  
			304 => 'Not Modified',  
			305 => 'Use Proxy',  
			306 => '(Unused)',  
			307 => 'Temporary Redirect',  
			400 => 'Bad Request',  
			401 => 'Unauthorized',  
			402 => 'Payment Required',  
			403 => 'Forbidden',  
			404 => 'Not Found',  
			405 => 'Method Not Allowed',  
			406 => 'Not Acceptable',  
			407 => 'Proxy Authentication Required',  
			408 => 'Request Timeout',  
			409 => 'Conflict',  
			410 => 'Gone',  
			411 => 'Length Required',  
			412 => 'Precondition Failed',  
			413 => 'Request Entity Too Large',  
			414 => 'Request-URI Too Long',  
			415 => 'Unsupported Media Type',  
			416 => 'Requested Range Not Satisfiable',  
			417 => 'Expectation Failed',  
			500 => 'Internal Server Error',  
			501 => 'Not Implemented',  
			502 => 'Bad Gateway',  
			503 => 'Service Unavailable',  
			504 => 'Gateway Timeout',  
			505 => 'HTTP Version Not Supported');
		return ($httpStatus[$statusCode]) ? $httpStatus[$statusCode] : $status[500];
	}

	// Internal wrapper to call web service using CURL
	private function CallAPI($method, $relativeUrl, $data = false)
	{
		$url = $this->ini["CKLS_URL"] . $relativeUrl;
		
		$curl = curl_init();
		switch ($method)
		{
			case "POST":
				curl_setopt($curl, CURLOPT_POST, 1);
				if ($data)
					curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
				break;
			case "PUT":
				curl_setopt($curl, CURLOPT_PUT, 1);
				break;
			default:
				if ($data)
					$url = sprintf("%s?%s", $url, http_build_query($data));
		}

		// API Key
		curl_setopt($curl, CURLOPT_HTTPHEADER,array('API-KEY: ' . $this->ini["API-KEY"]));

		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0); 
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

		$result = curl_exec($curl);

		curl_close($curl);

		return $result;
	}
	
	/*
		Retrieve a learner for given search parameters
		This function returns only one match. If no match or more than one is found, 
		a status message is sent back - and "success" is set to false.
	*/
	public function getLearner($args)
	{
		$relativeUrl = "Learner/?";
		foreach (get_object_vars($args) as $k => $v)
		{
			$relativeUrl = $relativeUrl . $k . "=" . $v . "&";
		}

		$response = json_decode($this->CallAPI("GET", $relativeUrl));
		$this->setHttpHeaders("application/json", 200);
		
		$data = new \stdClass;

		if ($response == "")
		{	
			$data->success = false;
			$data->message = "NO_LEARNER";
		}
		else if (count($response->value) > 1)
		{
			$data->success = false;
			$data->message = "LEARNERCOUNT_GT_1";
		}
		else
		{
			$data->success = true;
			$data->learner = $response->value[0]->firstName . " " . $response->value[0]->name;
			$data->learnerId = $response->value[0]->guid;
		}

		echo json_encode($data);
	}

	/*
		Retrieve a learner token for a given learner GUID
	*/
	public function getLearnerToken($args)
	{	
		// Get token
		$relativeUrl = "Learner/" . $args->learnerId . "/AuthToken";
		$response = json_decode($this->CallAPI("GET", $relativeUrl));

		$this->setHttpHeaders("application/json", 200);
		$data = new \stdClass;
		$data->success = false;
		$data->token = $response->value->token;

		echo json_encode($data);
	}
}
?>