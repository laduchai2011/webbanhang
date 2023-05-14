# #!/usr/bin/env bash
# # Wait for database to startup 
# sleep 60
# /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "20111995Hai" -i setup.sql

for i in {1..50};
do
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 20111995Hai -d master -i setup.sql
    if [ $? -eq 0 ]
    then
        echo "setup.sql completed"
        break
    else
        echo "not ready yet..."
        sleep 1
    fi
done