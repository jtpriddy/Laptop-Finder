SELECT wm.*, 
((CAST(processor_speed as UNSIGNED) * 1/2.6 + CAST(screen_size as DECIMAL) * 1/15 + CAST(ram as UNSIGNED) * 1/8 + CAST(battery_life as DECIMAL) * 1/8) * is_new 
* 20) as lScore, 
(((CAST(processor_speed as UNSIGNED) * 1/2.6 + CAST(screen_size as DECIMAL) * 1/15 + CAST(ram as UNSIGNED) * 1/8 + CAST(battery_life as DECIMAL) * 1/8) * is_new 
) * 1/price * 5000)  as vScore
FROM walmart wm
INNER JOIN
(SELECT walmart_id, MAX(instant) AS MaxInstant
FROM walmart
GROUP BY walmart_id) groupedwm
ON wm.walmart_id = groupedwm.walmart_id
AND wm.instant = groupedwm.MaxInstant
WHERE wm.price < 1500
AND wm.instant > (unix_timestamp(now()) - 43200) * 1000
ORDER BY vScore DESC;