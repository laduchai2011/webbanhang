FROM mcr.microsoft.com/mssql/server:2022-latest
# FROM mcr.microsoft.com/mssql/server

USER root

COPY setup.sql setup.sql
COPY setup_database.sh setup_database.sh
COPY entrypoint.sh entrypoint.sh

RUN chmod +x entrypoint.sh

CMD /bin/bash ./entrypoint.sh
# RUN ./setup_database.sh & ./opt/mssql/bin/sqlservr 
# CMD /bin/bash ./setup_database.sh & ./opt/mssql/bin/sqlservr 