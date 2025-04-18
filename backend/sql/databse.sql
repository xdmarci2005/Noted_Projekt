-- Active: 1744653728241@@127.0.0.1@3306@notesapp
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

ALTER TABLE Felhasznalok
ADD CONSTRAINT UserNameTooShort CHECK (LENGTH(FelhasznaloNev) >= 4),
ADD CONSTRAINT EmailInvalid CHECK (REGEXP_LIKE(Email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'));

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

ALTER TABLE `Jegyzetek`
ADD CONSTRAINT VisibiltyInvalid CHECK (Lathatosag = 1 OR Lathatosag = 0)

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
    MegosztasId INT AUTO_INCREMENT PRIMARY KEY,
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


Select `Jegyzetek`.`JegyzetId`,`JegyzetNeve`,`JegyzetTartalma` from `Jegyzetek` INNER JOIN `Megosztas` ON `Jegyzetek`.`JegyzetId` = `Megosztas`.`JegyzetId` WHERE `Megosztas`.`MegosztottFelhId` = 7

INSERT INTO `Megosztas` (`JegyzetId`,`MegosztottFelhId`,`GroupSharedId`,`Jogosultsag`) VALUES(4,7,NULL,"R")

Select `Jegyzetek`.`JegyzetId`,`JegyzetNeve`,`JegyzetTartalma` from `Jegyzetek` INNER JOIN `Megosztas` ON `Jegyzetek`.`JegyzetId` = `Megosztas`.`JegyzetId` WHERE Jegyzetek.Feltolto = 7

INSERT INTO `CsoportTagok` (`CsoportId`,`TagId`,`JogosultsagId`) VALUES (1,2,1)

SELECT * from `CsoportTagok` WHERE `CsoportId` = 1;

DELETE from `Csoportok` WHERE `CsoportId` = 1;

Delete from `Megosztas` WHERE `MegosztottFelhId` = 12 AND `JegyzetId` = 5


SELECT `FelhasznaloNev` from `Felhasznalok` INNER JOIN `CsoportTagok` ON `FelhasznaloId` = `TagId` WHERE `CsoportId` = 9;



Select `Jegyzetek`.`JegyzetId`,`JegyzetNeve`,`MegosztottCsopId`,`Jogosultsag` from `Jegyzetek` INNER JOIN `Megosztas` ON `Jegyzetek`.`JegyzetId` = `Megosztas`.`JegyzetId` WHERE `MegosztottCsopId` = 9


SELECT `FelhasznaloId`, `FelhasznaloNev` from `Felhasznalok` WHERE `FelhasznaloNev` LIKE '%A%'

SELECT `JegyzetId`, `JegyzetNeve` from `Jegyzetek` WHERE `JegyzetNeve` LIKE '%le%' AND `Lathatosag` = 1 AND `Feltolto` != 1

SELECT * FROM Csoportok WHERE CsoportId IN (SELECT CsoportId FROM `CsoportTagok` WHERE TagId = 7) AND `Tulajdonos` != 7

SELECT * FROM Csoportok WHERE `CsoportNev` LIKE '%Jozsi%' AND `Tulajdonos` = 8