<?php
if(isset($_POST['email'])) {
     
    $email_to = "info@sixoversix.net";
    $email_subject = "Signup list request";     
     
	//used if form does not submit correctly
    function died($message) {
        // your error code can go here
        echo "{ \"message\": \"";
        echo $message;
        echo "\" }";
        die();
    }
     
    // validation expected data exists
    if(!isset($_POST['name']) ||
        !isset($_POST['email'])) {
        died("There was a problem with the name or email sent.");       
    }
     
	//get data from form
    $name = $_POST['name'];
    $email = $_POST['email'];
	
	//check email
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/';
	if(!preg_match($email_exp,$email)) {
		died("There was a problem with the email sent");
	}

	//check user name
	if(strlen($name) < 2) {
		died("There was a problem with the name sent");
	}

	//if no errors, compile and send email
	$email_message = "Someone signed up:\n\n";
	     
	function clean_string($string) {
	    $bad = array("content-type","bcc:","to:","cc:","href");
	    return str_replace($bad,"",$string);
	}
	     
	$email_message .= "Name: ".clean_string($name)."\r\n\r\n";
	$email_message .= "Email: ".clean_string($email)."\r\n\r\n";
	     	     
	// create email headers
	$headers = 'From: '.$email."\r\n".'Reply-To: '.$email."\r\n" .'X-Mailer: PHP/' . phpversion();
	@mail($email_to, $email_subject, $email_message, $headers); 
	
	//finish. Success form is ignored if $error_message is set
    echo "{ \"message\": \"Success\" }";
	die();
}
?>