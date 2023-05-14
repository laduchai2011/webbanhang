SELECT
request_session_id,
resource_type,
resource_description,
request_mode,
request_type,
request_status
FROM sys.dm_tran_locks

SELECT
session_id,
wait_duration_ms,
wait_type,
blocking_session_id,
resource_description
FROM sys.dm_os_waiting_tasks

SELECT
session_id,
status,
wait_type,
wait_time,
wait_resource,
command
FROM sys.dm_exec_requests