--Юзерсы табличка для юзеров
CREATE TABLE Users
(
    id SERIAL PRIMARY KEY,
    Email VARCHAR(255) Unique,
    Username VARCHAR(255),
    Password VARCHAR(255),
    TelephoneNumber VARCHAR(255),
    Tag VARCHAR(255),
    Name VARCHAR(255),
    Age INT,
    Role VARCHAR(255),
    Banned BOOLEAN,
    Admin BOOLEAN,
    Person BOOLEAN,
    Image VARCHAR(255),
    Status VARCHAR(255)
);

CREATE TABLE Tournaments_User
(
    id SERIAL PRIMARY KEY,
    TournamentName VARCHAR(255),
    FOREIGN KEY (id) REFERENCES Users(id)
);

CREATE TABLE News_Admin
(
    id SERIAL PRIMARY KEY,
    NewsItem VARCHAR(255),
    FOREIGN KEY (id) REFERENCES Users(id)
);
CREATE TABLE Teams_User
(
    id SERIAL PRIMARY KEY,
    TeamName VARCHAR(255),
    FOREIGN KEY (id) REFERENCES Users(id)
);

-- Туринры 1x1 сеткой
CREATE TABLE Tournaments_1x1all
(
    id SERIAL PRIMARY KEY,
    TournamentName VARCHAR(255) UNIQUE,
    Type VARCHAR(255),
    Game VARCHAR(255),
    Format INT,
    NumOfParticipants INT,
    Date DATE,
    TimeFrom TIME,
    TimeTo TIME,
    CreateTime TIME
);

CREATE TABLE Retailers_1x1all
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RetailerEmail VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_1x1all(id) ON DELETE CASCADE,
    FOREIGN KEY (RetailerEmail) REFERENCES Users(Email) ON DELETE CASCADE
);

CREATE TABLE Participants_1x1all
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    ParticipantEmail VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_1x1all(id) ON DELETE CASCADE,
    FOREIGN KEY (ParticipantEmail) REFERENCES Users(Email) ON DELETE CASCADE
);

CREATE TABLE Results_1x1all
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    Round INT,
    Participant1 VARCHAR(255),
    Participant2 VARCHAR(255),
    Score1 INT,
    Score2 INT,
    Winner VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_1x1all(id) ON DELETE CASCADE,
    FOREIGN KEY (Participant1) REFERENCES Users(Email) ON DELETE CASCADE,
    FOREIGN KEY (Participant2) REFERENCES Users(Email) ON DELETE CASCADE,
    FOREIGN KEY (Winner) REFERENCES Users(Email) ON DELETE CASCADE
);


--1х1
CREATE TABLE Tournaments_1x1
(
    id SERIAL PRIMARY KEY,
    TournamentName VARCHAR(255) UNIQUE,
    Type VARCHAR(255),
    Game VARCHAR(255),
    Format INT,
    NumOfParticipants INT,
    Date DATE,
    TimeFrom TIME,
    TimeTo TIME,
    CreateTime TIME
);

CREATE TABLE Retailers_1x1
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RetailerEmail VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_1x1(id) ON DELETE CASCADE,
    FOREIGN KEY (RetailerEmail) REFERENCES Users(Email) ON DELETE CASCADE
);

CREATE TABLE Participants_1x1
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    ParticipantEmail VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_1x1(id) ON DELETE CASCADE,
    FOREIGN KEY (ParticipantEmail) REFERENCES Users(Email) ON DELETE CASCADE
);

CREATE TABLE Results_1x1
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RoundName VARCHAR(255),
    ParticipantEmail VARCHAR(255),
    Score INT,
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_1x1(id) ON DELETE CASCADE,
    FOREIGN KEY (ParticipantEmail) REFERENCES Users(Email) ON DELETE CASCADE
);


--1х1 тима
CREATE TABLE Tournaments_team
(
    id SERIAL PRIMARY KEY,
    TournamentName VARCHAR(255) UNIQUE,
    Type VARCHAR(255),
    Game VARCHAR(255),
    NumOfCommands INT,
    Date DATE,
    TimeFrom TIME,
    TimeTo TIME,
    CreateTime TIME
);

CREATE TABLE Retailers_team
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RetailerEmail VARCHAR(255),
    FOREIGN KEY
(TournamentID) REFERENCES Tournaments_team
(id) ON
DELETE CASCADE,
    FOREIGN KEY (RetailerEmail)
REFERENCES Users
(Email) ON
DELETE CASCADE
);

CREATE TABLE Teams_team
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    TeamName VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_team(id) ON DELETE CASCADE
);



CREATE TABLE Results_team
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RoundName VARCHAR(255),
    TeamID INT,
    Score INT,
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_team(id) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES Teams_team(id) ON DELETE CASCADE
);



--баттл рояль

CREATE TABLE Tournaments_b_r
(
    id SERIAL PRIMARY KEY,
    TournamentName VARCHAR(255) UNIQUE,
    Type VARCHAR(255),
    Game VARCHAR(255),
    Format INT,
    NumOfParticipants INT,
    Date DATE,
    TimeFrom TIME,
    TimeTo TIME,
    CreateTime TIME
);

CREATE TABLE Retailers_b_r
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RetailerEmail VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_b_r(id) ON DELETE CASCADE,
    FOREIGN KEY (RetailerEmail) REFERENCES Users(Email) ON DELETE CASCADE
);

CREATE TABLE Participants_b_r
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    ParticipantEmail VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_b_r(id) ON DELETE CASCADE,
    FOREIGN KEY (ParticipantEmail) REFERENCES Users(Email) ON DELETE CASCADE
);

CREATE TABLE Results_b_r
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RoundName VARCHAR(255),
    ParticipantEmail VARCHAR(255),
    Score INT,
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_b_r(id) ON DELETE CASCADE,
    FOREIGN KEY (ParticipantEmail) REFERENCES Users(Email) ON DELETE CASCADE
);




--баттл рояль тима
CREATE TABLE Tournaments_b_r_t
(
    id SERIAL PRIMARY KEY,
    TournamentName VARCHAR(255) UNIQUE,
    Type VARCHAR(255),
    Game VARCHAR(255),
    NumOfCommands INT,
    Date DATE,
    TimeFrom TIME,
    TimeTo TIME,
    CreateTime TIME
);

CREATE TABLE Retailers_b_r_t
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RetailerEmail VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_b_r_t(id) ON DELETE CASCADE,
    FOREIGN KEY (RetailerEmail) REFERENCES Users(Email) ON DELETE CASCADE
);

CREATE TABLE Teams_b_r_t
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    TeamName VARCHAR(255),
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_b_r_t(id) ON DELETE CASCADE
);

CREATE TABLE Results_b_r_t
(
    id SERIAL PRIMARY KEY,
    TournamentID INT,
    RoundName VARCHAR(255),
    TeamID INT,
    Score INT,
    FOREIGN KEY (TournamentID) REFERENCES Tournaments_b_r_t(id) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES Teams_b_r_t(id) ON DELETE CASCADE
);




-- команды 
CREATE TABLE Teams
(
    id SERIAL PRIMARY KEY,
    TeamName VARCHAR(255),
    NumOfPeople INT,
    RetailerEmail VARCHAR(255),
    FOREIGN KEY (RetailerEmail) REFERENCES Users(Email)
);

CREATE TABLE TeamMembers
(
    id SERIAL PRIMARY KEY,
    TeamID INT,
    MemberEmail VARCHAR(255),
    FOREIGN KEY (TeamID) REFERENCES Teams(id),
    FOREIGN KEY (MemberEmail) REFERENCES Users(Email)
);

--новости
CREATE TABLE News
(
    id SERIAL PRIMARY KEY,
    Title VARCHAR(255),
    Information TEXT,
    Image VARCHAR(255),
    AdminEmail VARCHAR(255),
    FOREIGN KEY (AdminEmail) REFERENCES Users(Email)
);

-- ALTER TABLE Users ADD COLUMN id SERIAL PRIMARY KEY;






CREATE VIEW AllTournaments
AS
    (
                SELECT id, TournamentName, Type, Game, Format, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime
        FROM Tournaments_1x1all
    UNION ALL
        SELECT id, TournamentName, Type, Game, Format, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime
        FROM Tournaments_1x1
    UNION ALL
        SELECT id, TournamentName, Type, Game, Format, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime
        FROM Tournaments_b_r
);




CREATE VIEW AllTournamentsT
AS
    (
            SELECT id, TournamentName, Type, Game, NumOfCommands, Date, TimeFrom, TimeTo, CreateTime
        FROM Tournaments_team
    UNION ALL
        SELECT id, TournamentName, Type, Game, NumOfCommands, Date, TimeFrom, TimeTo, CreateTime
        FROM Tournaments_b_r_t
 

);


CREATE VIEW AllParticipants
AS
    (
                SELECT id, TournamentID, ParticipantEmail
        FROM Participants_1x1all
    UNION ALL
        SELECT id, TournamentID, ParticipantEmail
        FROM Participants_1x1
    UNION ALL
        SELECT id, TournamentID, ParticipantEmail
        FROM Participants_b_r 
);

CREATE VIEW AllParticipantsT
AS
    (
            SELECT id, TournamentID, TeamName
        FROM Teams_team
    UNION ALL
        SELECT id, TournamentID, TeamName
        FROM Teams_b_r_t 

   
);



INSERT INTO Users
VALUES(admin@gmail.com)

INSERT INTO Users
    (
    Email,
    Username,
    Password,
    TelephoneNumber,
    Tag,
    Name,
    Age,
    Role,
    Banned,
    Admin,
    Person,
    Image,
    Status
    )


VALUES
    (
        'admin@gmail.com',
        'admin',
        'adminin',
        '1234567890',
        'AdminTag',
        'Admin Name',
        30,
        'Admin',
        FALSE,
        TRUE,
        TRUE,
        'path/to/image.png',
        'offline'
),
    ('user1@gmail.com', 'user1', 'password123', '1234567891', 'userTag1', 'User One', 25, 'User', FALSE, FALSE, TRUE, 'user1.jpg', 'Active'),
    ('user2@gmail.com', 'user2', 'password123', '1234567892', 'userTag2', 'User Two', 28, 'User', FALSE, FALSE, TRUE, 'user2.jpg', 'Active');

INSERT INTO Tournaments_1x1all
    (TournamentName, Type, Game, Format, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime)
VALUES
    ('Tournament 1', '1x1all', 'Game 1', 1, 16, '2024-07-01', '10:00', '12:00', '09:00'),
    ('Tournament 2', '1x1all', 'Game 2', 2, 32, '2024-07-02', '14:00', '16:00', '13:00');


INSERT INTO Tournaments_1x1
    (TournamentName, Type, Game, Format, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime)
VALUES
    ('Tournament 3', '1x1', 'Game 3', 3, 16, '2024-07-03', '10:00', '12:00', '09:00'),
    ('Tournament 4', '1x1', 'Game 4', 4, 32, '2024-07-04', '14:00', '16:00', '13:00');


INSERT INTO Participants_1x1all
    (TournamentID, ParticipantEmail)
VALUES
    (1, 'user1@gmail.com'),
    (1, 'user2@gmail.com'),
    (2, 'user1@gmail.com');


INSERT INTO Users
    (Email, Username, Password, TelephoneNumber, Tag, Name, Age, Role, Banned, Admin, Person, Image, Status)
VALUES
    ('user1@gmail.com', 'user1', 'password123', '1234567891', 'userTag1', 'User One', 25, 'User', FALSE, FALSE, TRUE, 'user1.jpg', 'Active'),
    ('user2@gmail.com', 'user2', 'password123', '1234567892', 'userTag2', 'User Two', 28, 'User', FALSE, FALSE, TRUE, 'user2.jpg', 'Active');


INSERT INTO Teams
    (TeamName, NumOfPeople, RetailerEmail)
VALUES
    ('Team A', 10, 'admin@gmail.com'),
    ('Team B', 15, 'admin@gmail.com');



INSERT INTO Users
    (Email, Username, Password, TelephoneNumber, Tag, Name, Age, Role, Banned, Admin, Person, Image, Status)
VALUES
    ('john.doe@example.com', 'john_doe', 'password123', '1234567890', 'user', 'John Doe', 30, 'User', FALSE, FALSE, TRUE, 'john.jpg', 'Active'),
    ('jane.smith@example.com', 'jane_smith', 'password123', '0987654321', 'admin', 'Jane Smith', 28, 'User', FALSE, FALSE, TRUE, 'jane.jpg', 'Active'),
    ('mike.jones@example.com', 'mike_jones', 'password123', '1112223333', 'user', 'Mike Jones', 35, 'User', FALSE, FALSE, TRUE, 'mike.jpg', 'Active'),
    ('alice.williams@example.com', 'alice_williams', 'password123', '4445556666', 'user', 'Alice Williams', 22, 'User', FALSE, FALSE, TRUE, 'alice.jpg', 'Active'),
    ('bob.brown@example.com', 'bob_brown', 'password123', '7778889999', 'admin', 'Bob Brown', 40, 'User', FALSE, FALSE, TRUE, 'bob.jpg', 'Active');



INSERT INTO News
    (Title, Information, Image, AdminEmail)
VALUES
    ('SAJKDnaskjnd', 'Это информация о новости 1', 'image1.jpg', 'admin@gmail.com'),

    ('We are opening', 'First staring', 'news.jpg', 'admin@gmail.com');