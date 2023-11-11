CREATE TABLE IF NOT EXISTS teams (
    tid SERIAL PRIMARY KEY,
    teamname TEXT,
    teamname2 TEXT,
    pass TEXT,
    status TEXT,
    score INTEGER,
    penalty BIGINT,
    name1 TEXT,
    roll1 TEXT,
    branch1 TEXT,
    email1 TEXT,
    phone1 TEXT,
    name2 TEXT,
    roll2 TEXT,
    branch2 TEXT,
    email2 TEXT,
    phone2 TEXT,
    name3 TEXT,
    roll3 TEXT,
    branch3 TEXT,
    email3 TEXT,
    phone3 TEXT,
    platform TEXT,
    ip TEXT,
    session TEXT,
    gid INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS problems (
    pid SERIAL PRIMARY KEY,
    code TEXT,
    name TEXT,
    type TEXT,
    status TEXT,
    pgroup TEXT,
    statement TEXT,
    image BYTEA,
    imgext TEXT,
    input TEXT,
    output TEXT,
    timelimit INTEGER,
    score INTEGER,
    languages TEXT,
    options TEXT
);

CREATE TABLE IF NOT EXISTS runs (
    rid SERIAL PRIMARY KEY,
    pid INTEGER,
    tid INTEGER,
    language TEXT,
    name TEXT,
    code TEXT,
    time TEXT,
    result TEXT,
    error TEXT,
    access TEXT
);

    CREATE TABLE IF NOT EXISTS admin (
        variable TEXT,
        value TEXT
    );

    CREATE TABLE IF NOT EXISTS logs (
        time DECIMAL(20,6) NOT NULL PRIMARY KEY,
        ip TEXT,
        tid INTEGER,
        request TEXT
    );

    CREATE TABLE IF NOT EXISTS clar (
        time INTEGER NOT NULL PRIMARY KEY,
        tid INTEGER,
        pid INTEGER,
        query TEXT,
        reply TEXT,
        access TEXT,
        createtime INTEGER
    );

    CREATE TABLE IF NOT EXISTS groups (
        gid SERIAL PRIMARY KEY,
        groupname TEXT,
        statusx INTEGER
    );

INSERT INTO
    teams (teamname, pass, status, gid)
VALUES
    ('admin', 'admin', 'Admin', 1);

INSERT INTO
    problems (
        pid,
        code,
        name,
        type,
        status,
        pgroup,
        statement,
        input,
        output,
        timelimit,
        score,
        languages
    )
VALUES
    (
        1,
        'TEST',
        'Squares',
        'Ad-Hoc',
        'Active',
        '#00 Test',
        'problem_statement',
        'input_data',
        'output_data',
        1,
        0,
        'C,C++,C#,Java,Python,Ruby'
    );

INSERT INTO
    runs (rid, pid, tid, language, name, code, access)
VALUES
    (1, 1, 1, 'C', 'code', 'code_in_c', 'public'),
    (2, 1, 1, 'C++', 'code', 'code_in_cpp', 'public'),
    (
        3,
        1,
        1,
        'C#',
        'code',
        'code_in_csharp',
        'public'
    ),
    (
        4,
        1,
        1,
        'Java',
        'code',
        'code_in_java',
        'public'
    ),
    (
        5,
        1,
        1,
        'Python',
        'code',
        'code_in_python',
        'public'
    ),
    (
        6,
        1,
        1,
        'Ruby',
        'code',
        'code_in_ruby',
        'public'
    );

INSERT INTO
    admin (variable, value)
VALUES
    ('mode', 'Passive'),
    ('lastjudge', '0'),
    ('ajaxrr', '0'),
    ('mode', 'Passive'),
    ('penalty', '20'),
    ('mysublist', '5'),
    ('allsublist', '5'),
    ('ranklist', '5'),
    ('clarpublic', '3'),
    ('clarprivate', '3'),
    ('regautoauth', '1'),
    ('multilogin', '0'),
    ('clarpage', '5'),
    ('substatpage', '5'),
    ('probpage', '5'),
    ('teampage', '5'),
    ('rankpage', '5'),
    ('logpage', '10'),
    (
        'notice',
        'Announcements Welcome to the Nexeum Online Judge.'
    );