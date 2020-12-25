<?php
header('Access-Control-Allow-Origin: *');
  $conn = new mysqli("localhost","root","peanutbutter94","laptop_data");
  $min = $_GET['min'];
  $max = $_GET['max'];
  $query = "SELECT wm.*, ((CAST(processor_speed as UNSIGNED) * 1/2.6 + CAST(screen_size as DECIMAL) * 1/15 + CAST(ram as UNSIGNED) * 1/8 + CAST(battery_life as DECIMAL) * 1/8) * is_new
* 20) as lScore,
(((CAST(processor_speed as UNSIGNED) * 1/2.6 + CAST(screen_size as DECIMAL) * 1/15 + CAST(ram as UNSIGNED) * 1/8 + CAST(battery_life as DECIMAL) * 1/8) * is_new
) * 1/price * 5000)  as vScore FROM walmart wm INNER JOIN (SELECT walmart_id, MAX(instant) AS MaxInstant FROM walmart GROUP BY walmart_id) groupedwm ON wm.walmart_id = groupedwm.walmart_id AND wm.instant = groupedwm.MaxInstant WHERE wm.price < " . $max . " AND wm.price > " . $min . " AND wm.instant > (unix_timestamp(now()) -43200) * 1000 ORDER BY vScore DESC";
  if($result = $conn -> query($query)){
    $data = array();
    while($row = $result -> fetch_assoc()){
      $data[] = $row;
    }
  }
  echo json_encode($data);
  $conn -> close();
 ?>
