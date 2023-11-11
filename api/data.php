<?php
function mysql_initiate()
{
    global $admin, $ajaxlogout, $sessionid;

    $link = mysqli_connect("localhost", "root", "", "nexeum");
    if (!$link) {
        $_SESSION["message"][] = "SQL Error: Could Not Establish Connection.";
        return;
    }

    $tableQueries = [
        "CREATE TABLE IF NOT EXISTS teams (
            tid int not null primary key auto_increment,
            teamname tinytext,
            teamname2 tinytext,
            pass tinytext,
            status tinytext,
            score int,
            penalty bigint,
            name1 tinytext,
            roll1 tinytext,
            branch1 tinytext,
            email1 tinytext,
            phone1 tinytext,
            name2 tinytext,
            roll2 tinytext,
            branch2 tinytext,
            email2 tinytext,
            phone2 tinytext,
            name3 tinytext,
            roll3 tinytext,
            branch3 tinytext,
            email3 tinytext,
            phone3 tinytext,
            platform text,
            ip text,
            session tinytext,
            gid int not null
        )",
        "CREATE TABLE IF NOT EXISTS problems (
            pid int not null primary key auto_increment,
            code tinytext,
            name tinytext,
            type tinytext,
            status tinytext,
            pgroup tinytext,
            statement longtext,
            image blob,
            imgext tinytext,
            input longtext,
            output longtext,
            timelimit int,
            score int,
            languages tinytext,
            options tinytext
        )",
        "CREATE TABLE IF NOT EXISTS runs (
            rid int not null primary key auto_increment,
            pid int,
            tid int,
            language tinytext,
            name tinytext,
            code longtext,
            time tinytext,
            result tinytext,
            error text,
            access tinytext,
            submittime int,
            output longtext
        )",
        "CREATE TABLE IF NOT EXISTS admin (
            variable tinytext,
            value longtext
        )",
        "CREATE TABLE IF NOT EXISTS logs (
            time DECIMAL(20,6) not null primary key,
            ip tinytext,
            tid int,
            request tinytext
        )",
        "CREATE TABLE IF NOT EXISTS clar (
            time int not null primary key,
            tid int,
            pid int,
            query text,
            reply text,
            access tinytext,
            createtime int
        )",
        "CREATE TABLE IF NOT EXISTS groups (
            gid int not null primary key auto_increment,
            groupname tinytext,
            statusx int
        )"
    ];

    foreach ($tableQueries as $query) {
        mysqli_query($link, $query);
    }

    $teamQuery = mysqli_query($link, "SELECT * FROM teams");
    if ($teamQuery) {
        if (mysqli_num_rows($teamQuery) == 0) {
            mysqli_query($link, "INSERT INTO teams (teamname, pass, status, gid) VALUES ('admin', 'admin', 'Admin', 1)");
        }
    } else {
        echo "Error en la consulta: " . mysqli_error($link);
    }

    $problemQuery = mysqli_query($link, "SELECT * FROM problems");
    if (mysqli_num_rows($problemQuery) == 0) {
        $problemData = [
            'pid' => 1,
            'code' => 'TEST',
            'name' => 'Squares',
            'type' => 'Ad-Hoc',
            'status' => 'Active',
            'pgroup' => '#00 Test',
            'statement' => addslashes(file_get('data/example/problem.txt')),
            'input' => addslashes(file_get('data/example/input.txt')),
            'output' => addslashes(file_get('data/example/output.txt')),
            'timelimit' => 1,
            'score' => 0,
            'languages' => 'C,C++,C#,Java,Python,Ruby'
        ];
        $problemDataQuery = "INSERT INTO problems (" . implode(", ", array_keys($problemData)) . ") VALUES ('" . implode("', '", $problemData) . "')";
        mysqli_query($link, $problemDataQuery);
    }

    $runQuery = mysqli_query($link, "SELECT * FROM runs");
    if (mysqli_num_rows($runQuery) == 0) {
        $runData = [
            ['rid' => 1, 'pid' => 1, 'tid' => 1, 'language' => 'C', 'name' => 'code', 'code' => addslashes(file_get('data/example/code.c')), 'access' => 'public'],
            ['rid' => 2, 'pid' => 1, 'tid' => 1, 'language' => 'C++', 'name' => 'code', 'code' => addslashes(file_get('data/example/code.cpp')), 'access' => 'public'],
            ['rid' => 3, 'pid' => 1, 'tid' => 1, 'language' => 'C#', 'name' => 'code', 'code' => addslashes(file_get('data/example/code.cs')), 'access' => 'public'],
            ['rid' => 4, 'pid' => 1, 'tid' => 1, 'language' => 'Java', 'name' => 'code', 'code' => addslashes(file_get('data/example/code.java')), 'access' => 'public'],
            ['rid' => 5, 'pid' => 1, 'tid' => 1, 'language' => 'Python', 'name' => 'code', 'code' => addslashes(file_get('data/example/code.py')), 'access' => 'public'],
            ['rid' => 6, 'pid' => 1, 'tid' => 1, 'language' => 'Ruby', 'name' => 'code', 'code' => addslashes(file_get('data/example/code.rb')), 'access' => 'public']
        ];
        foreach ($runData as $run) {
            $runDataQuery = "INSERT INTO runs (" . implode(", ", array_keys($run)) . ") VALUES (" . implode(", ", array_map(function ($value) {
                return "'" . $value . "'";
            }, $run)) . ")";
            mysqli_query($link, $runDataQuery);
        }
    }

    $adminQueries = [
        "INSERT INTO admin VALUES ('mode', 'Passive')",
        "INSERT INTO admin VALUES ('lastjudge', '0')",
        "INSERT INTO admin VALUES ('ajaxrr', '0')",
        "INSERT INTO admin VALUES ('mode', 'Passive')",
        "INSERT INTO admin VALUES ('penalty', '20')",
        "INSERT INTO admin VALUES ('mysublist', '5')",
        "INSERT INTO admin VALUES ('allsublist', '5')",
        "INSERT INTO admin VALUES ('ranklist', '5')",
        "INSERT INTO admin VALUES ('clarpublic', '3')",
        "INSERT INTO admin VALUES ('clarprivate', '3')",
        "INSERT INTO admin VALUES ('regautoauth', '1')",
        "INSERT INTO admin VALUES ('multilogin', '0')",
        "INSERT INTO admin VALUES ('clarpage', '5')",
        "INSERT INTO admin VALUES ('substatpage', '5')",
        "INSERT INTO admin VALUES ('probpage', '5')",
        "INSERT INTO admin VALUES ('teampage', '5')",
        "INSERT INTO admin VALUES ('rankpage', '5')",
        "INSERT INTO admin VALUES ('logpage', '10')",
        "INSERT INTO admin VALUES ('notice', 'Announcements Welcome to the Nexeum Online Judge.')"
    ];
}


?>