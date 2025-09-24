USE events_api_db;

INSERT INTO
    users (name, email, password, role)
VALUES
    (
        'Admin User',
        'admin@example.com',
        '$2b$10$ekguKZMlHTXfZcmeZFq6TOuTSqS.ptmvZKeKvO.r6ulgTc5gD9gbe',
        'admin'
    ),
    (
        'Volunteer User',
        'volunteer@example.com',
        '$2b$10$ekguKZMlHTXfZcmeZFq6TOuTSqS.ptmvZKeKvO.r6ulgTc5gD9gbe',
        'volunteer'
    );

INSERT INTO
    events (
        title,
        description,
        date,
        location,
        max_volunteers,
        created_by
    )
VALUES
    (
        'Blood Donation Campaign',
        'Help save lives by donating blood.',
        '2025-10-15',
        'Main IFRS Campus',
        100,
        1
    ),
    (
        'Book Exchange Fair',
        'Exchange used books and promote reading.',
        '2025-12-05',
        'Public Library',
        60,
        1
    );