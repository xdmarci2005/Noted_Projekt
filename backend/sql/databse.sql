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

-- INSERTS:
INSERT INTO Jegyzetek (Feltolto, JegyzetNeve, Lathatosag, UtolsoFrissites, UtolsoFrissito) VALUES
(8, '1744667652108_file', 1, '2025-04-14 21:54:12', 8),
(8, '1744622176063_NickMegintAtirta', 1, '2025-04-14 09:16:16', 9),
(8, '1744484580577_nem nevtelen dokumentum', 1, '2025-04-12 19:03:00', 9),
(9, '1744468706421_Nevtelen Dokumentum', 1, '2025-04-12 14:38:26', 9),
(9, '1744468912994_UjDokNeve', 1, '2025-04-12 14:41:53', 9),
(9, '1744468944678_UjabbDok', 1, '2025-04-12 14:42:24', 9),
(9, '1744469012145_LegUjabbJegyzet', 1, '2025-04-12 14:43:32', 9),
(8, '1744667643644_uj jegyzetNev', 1, '2025-04-14 21:54:03', 8),
(8, '1744658124781_SzabadAtIrni', 1, '2025-04-14 19:15:24', 8);

-- Jelszo: Titkos11
INSERT INTO Felhasznalok (FelhasznaloNev, Jelszo, Email, Statusz, JogosultsagId) VALUES
('JhonDoe', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'john.doe@example.com', 2, 1),
('Alex Johnson', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'alex.johnson@example.com', 1, 1),
('Jane Smith', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'jane.smith@example.com', 1, 1),
('Jozsefalfred', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'jozsi@example.com', 3, 1),
('Nick', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'nick@example.com', 2, 1),
('Nicolas', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'nicolas@example.com', 1, 1),
('nemtom', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'nemtom@nemtom.gov', 1, 1),
('nemtom12', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'nemtom@nemtom.com', 1, 1),
('jozsisteiner', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'jozsef@hotmail.com', 3, 1),
('akarki', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'akarmi@gmail.coma', 1, 1),
('Tatuki', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'tatuki@gmail.com', 3, 1),
('ValamiFelhNev', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'egyemailcim@gmail.com', 1, 1),
('Albert', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'albert@gmail.moc', 1, 1),
('KissPéter', 'cb4195fb096c22e34e8fae3e5ca67663de7d73b89f7f97f869dc4a6a1d978a01', 'kisspeter@gmail.moc', 1, 1),
('teszt', '74c7947f3cc19f9305f8ddea8e115614cc3483b82eb018ba02e22cfe7eadaca7', 'tesztemail@gmail.com', 1, 1);