INSERT INTO departments
  (id, dept_name)
VALUES
    (default,'Sales'),
    (default,'Engineering'),
    (default,'Finance'),
    (default,'Legal');

INSERT INTO roles
  (id, title, salary, department_id)
VALUES
    (default,'Sales Lead', 100000, 1),
    (default, 'Salesperson', 80000, 1),
    (default,'Lead Engineer', 150000, 2),
    (default,'Software Engineer', 120000, 2),
    (default,'Account Manager', 160000, 3),
    (default,'Accountant', 125000, 3),
    (default,'Legal Team Lead', 250000, 4),
    (default,'Lawyer', 190000, 4);

INSERT INTO employees
  (id, first_name, last_name, role_id, manager_id)
VALUES
  (default,'John', 'Doe', 1, NULL),
  (default,'Mike', 'Chan', 2, 1),
  (default,'Ashley', 'Rodriguez', 3, NULL),
  (default,'Kevin', 'Tupik', 4, 3),
  (default,'Kunal', 'Singh', 5, NULL),
  (default,'Malia', 'Brown', 6, 5),
  (default,'Sarah', 'Lourd', 7, NULL),
  (default,'Tom', 'Allen', 8, 7),
  (default,'Sam', 'Kasj', 1, 3);