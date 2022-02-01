FROM skillbillsrl/liquibase

COPY liquibase.yml /
COPY translations.sql /
COPY default_lines.sql /
COPY postgresql-42.2.2.jar /drivers/postgresql-42.2.2.jar

CMD ["update"]