<?php
    require 'dependencies.php';

    if (isset( $_GET['resource'])) {
        $resource = $_GET['resource'];
    }
    else {
        $resource = 'home';
    }
    if (isset($_GET[ 'method' ])) {
        $method = $_GET['method'];
    }
    else {
        $method = 'view';
    }

    $methods = array_flip([
        'createview', // displays form that allows user to create a resource
        'create', // creates a resource
        'view', // shows a resource
        'listing', // shows a list of resources of a particular resource type
        'updateview', // displays form that allows user to update a resource
        'update', // updates a resource
        'deleteview', // displays form that allows user to delete a resource
        'delete' // deletes a resource
    ]);
    if (!isset($methods[$method])) {
        die( 'Invalid method specified' );
    }

    $controllerFile = 'controllers/' . $resource . '.php';

    if (!file_exists($controllerFile)) {
        die('Invalid resource specified');
    }

    include $controllerFile;

    $controllerName = $resource . 'Controller';

    // instantiate controller
    $controller = new $controllerName();

    // use reflection to call the controller used named arguments
    $this_reflection = new ReflectionObject($controller);
    $method_reflection = $this_reflection->getMethod($method);

    $parameters = $method_reflection->getParameters();
    $arguments = [];

    // differentiate between GET and POST methods to avoid CSRF
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $vars = $_POST;
    }
    else {
        $vars = $_GET;
    }

    // for each parameter that the controller expects...
    foreach ($parameters as $parameter) {
        // check if the parameter has been passed to us using GET or POST with the same name
        if (isset($vars[$parameter->name])) {
            // it was passed, give the value as an argument to the controller method
            $arguments[] = $vars[$parameter->name];
        }
        else {
            try {
                // see if the argument in the controller has a default value
                // if it does, provide that value
                $arguments[] = $parameter->getDefaultValue();
            }
            catch (ReflectionException $e) {
                // if it doesn't, just provide it with null
                $arguments[] = null;
            }
        }
    }
    return call_user_func_array([$controller, $method], $arguments);
?>
