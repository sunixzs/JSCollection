<?php
header('Content-Type: text/html; charset=utf-8');

define("DIR", __DIR__ . "/");

require_once dirname(dirname(__DIR__)) .'/autoload.php';
//require_once dirname(dirname(__DIR__)) .'/../vendor/autoload.php';

$minifier = new Sunixzs\JavaScriptMinifier\Wrapper();

$minifier->addFile(DIR . "src/AvailableSpace/Images.js", DIR . "dist/AvailableSpace/Images.js");
$minifier->addFile(DIR . "src/AvailableSpace/BackgroundImages.js", DIR . "dist/AvailableSpace/BackgroundImages.js");
$minifier->addFile(DIR . "src/Dom/Node.js", DIR . "dist/Dom/Node.js");
$minifier->addFile(DIR . "src/Dom/Element.js", DIR . "dist/Dom/Element.js");
$minifier->addFile(DIR . "src/Event/Namespace.js", DIR . "dist/Event/Namespace.js");
$minifier->addFile(DIR . "src/Page/ScrollActiveClasses.js", DIR . "dist/Page/ScrollActiveClasses.js");
$minifier->addFile(DIR . "src/Page/ScrolledClasses.js", DIR . "dist/Page/ScrolledClasses.js");
$minifier->addFile(DIR . "src/ContentElement/GenericSwipe.js", DIR . "dist/ContentElement/GenericSwipe.js");
$minifier->addFile(DIR . "src/Storage/Local.js", DIR . "dist/Storage/Local.js");

$minifier->minify();