-- Active: 1728994525220@@127.0.0.1@3306@notesapp
-- Create Database
CREATE DATABASE NotesApp;

-- 1. Jogosultságok tábla (Jogosultsags table for Permissions)
CREATE TABLE Jogosultsagok (
    JogosultsagId INT AUTO_INCREMENT PRIMARY KEY,
    Jogosultsag VARCHAR(255) NOT NULL -- Jogosultságok (Admin, Moderator, Member)
);

-- 2. Felhasználók tábla (Users table)
CREATE TABLE Felhasznalok (
    FelhasznaloId INT AUTO_INCREMENT PRIMARY KEY, 
    FelhasznaloNev VARCHAR(255) UNIQUE NOT NULL,  
    Jelszo BLOB NOT NULL,               -- Jelszó (hashelt)
    Email VARCHAR(255) UNIQUE NOT NULL,          
    Statusz INT NOT NULL,               -- Státusz (0 = blockolt, 1 = aktív)
    JogosultsagId INT,                                   
    FOREIGN KEY (JogosultsagId) REFERENCES Jogosultsagok(JogosultsagId) 
);

-- 3. Jegyzetek tábla (Notes table)
CREATE TABLE Jegyzetek (
    JegyzetId INT AUTO_INCREMENT PRIMARY KEY,          
    Feltolto INT NOT NULL,                                     
    JegyzetNeve VARCHAR(255) NOT NULL,                 
    Lathatosag INT NOT NULL,            -- Láthatóság (0 = privát, 1 = nyílvános)                    
    UtolsoFrissites TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UtolsoFrissito INT,                               
    FOREIGN KEY (Feltolto) REFERENCES Felhasznalok(FelhasznaloId) ON DELETE CASCADE,
    FOREIGN KEY (UtolsoFrissito) REFERENCES Felhasznalok(FelhasznaloId)
);

-- 4. Csoportok tábla (Groups table)
CREATE TABLE Csoportok (
    CsoportId INT AUTO_INCREMENT PRIMARY KEY,
    Tulajdonos INT(11) NOT NULL,
    CsoportNev VARCHAR(255) NOT NULL ,
    UNIQUE(CsoportNev,Tulajdonos),
    Foreign KEY (Tulajdonos) REFERENCES Felhasznalok(FelhasznaloId) ON DELETE CASCADE
);

-- 5. Csoport tagok tábla (Group Members table)
CREATE TABLE CsoportTagok (
    CsoportId INT,                               
    TagId INT,                                   
    JogosultsagId INT, 
    UNIQUE(CsoportId,TagId),
    FOREIGN KEY (CsoportId) REFERENCES Csoportok(CsoportId) ON DELETE CASCADE,
    FOREIGN KEY (TagId) REFERENCES Felhasznalok(FelhasznaloId) ON DELETE CASCADE,
    FOREIGN KEY (JogosultsagId) REFERENCES Jogosultsagok(JogosultsagId)
);

-- 6. Megosztás tábla (Shares table for Notes)

CREATE TABLE Megosztas (
    JegyzetId INT,
    MegosztottFelhId INT,                        
    MegosztottCsopId INT,                           
    Jogosultsag VARCHAR(50),        -- Jogosultsága (Read, Write, Share)
    UNIQUE(JegyzetId, MegosztottFelhId),
    UNIQUE(JegyzetId, MegosztottCsopId),
    FOREIGN KEY (JegyzetId) REFERENCES Jegyzetek(JegyzetId) ON DELETE CASCADE,   
    FOREIGN KEY (MegosztottFelhId) REFERENCES Felhasznalok(FelhasznaloId) ON DELETE CASCADE, 
    FOREIGN KEY (MegosztottCsopId) REFERENCES Csoportok(CsoportId) ON DELETE CASCADE   
);

DROP Table Megosztas

-- Alap jogosultságok felétele
INSERT INTO Jogosultsagok (Jogosultsag) 
VALUES ('Member'), ('Moderator'), ('Admin');


Select * from Felhasznalok where FelhasznaloId = 8

CREATE Trigger insertUser
BEFORE INSERT
ON Felhasznalok
for each row set
new.Email = LOWER(new.Email),
new.Jelszo = `Titkos`(new.Jelszo);

CREATE FUNCTION `Titkos`(pwd VARCHAR(100)) RETURNS blob
    DETERMINISTIC
Begin
    DECLARE titkositot BLOB;
    set titkositot = SHA2(pwd,256);
    RETURN titkositot;
    END

CREATE FUNCTION `Login`(Email VARCHAR(100), Jelszo VARCHAR(100)) RETURNS int
    DETERMINISTIC
Begin
    DECLARE ok INTEGER;
    set ok = 0;
    SELECT  `FelhasznaloId` into ok from Felhasznalok WHERE (Felhasznalok.Email = Email) and (Felhasznalok.Jelszo = Titkos(Jelszo));
    RETURN ok;
    END

-- Alap jogosultságok felétele
INSERT INTO Jogosultsagok (Jogosultsag) 
VALUES ('Admin'), ('Moderator'), ('Member');