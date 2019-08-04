DROP TABLE IF EXISTS M_Majors;
CREATE TABLE IF NOT EXISTS M_Majors (
	MJID		serial		not null,
	Subject		text		not null,
	MajorName	text		not null,
	School		text		not null,
Primary Key (MJID)
);

DROP TABLE IF EXISTS M_Classes;
CREATE TABLE IF NOT EXISTS M_Classes (
	MarID		serial		not null,
	Subject		text		not null,
	CourseNum	text		not null,
	CourseName	text		not null,
	Credits		integer		not null,
Primary Key (MarID)
);

DROP TABLE IF EXISTS Major_Classes;
CREATE TABLE IF NOT EXISTS Major_Classes (
	MJID		serial		not null	references M_Majors(MJID),
	MarID		serial		not null	references M_Classes(MarID),
Primary Key (MJID, MarID)
);

DROP TABLE IF EXISTS M_Minors;
CREATE TABLE IF NOT EXISTS M_Minors (
	MinID		serial		not null,
	MinorName	text		not null,
	Subject		text		not null,
	School		text		not null,
Primary Key (MinID)
);

DROP TABLE IF EXISTS Minor_Classes;
CREATE TABLE IF NOT EXISTS Minor_Classes (
	MinId		serial		not null	references M_Minors(MinID),
	MarID		serial		not null	references M_Classes(MarID),
Primary Key (MinID, MarID)
);

DROP TABLE IF EXISTS D_Classes;
CREATE TABLE IF NOT EXISTS D_Classes (
	DID			serial		not null,
	Subject		text		not null,
	CourseNum	text		not null,
	CourseName	text		not null,
	Credits		text		not null,
Primary Key (DID)
);

DROP TABLE IF EXISTS Cred_Transfers;
CREATE TABLE IF NOT EXISTS Cred_Transfers (
	DID			serial		not null	references D_Classes(DID),
	MarID		serial		not null	references M_Classes(MarID),
Primary Key (DID, MarID)
);

DROP TABLE IF EXISTS People;
CREATE TABLE IF NOT EXISTS People (
	PID			serial		not null,
	FName		text		not null,
	LName		text		not null,
	EmailAdd	text		not null,
Primary Key (PID)
);

DROP TABLE IF EXISTS Admins;
CREATE TABLE IF NOT EXISTS Admins (
	AID			serial		not null	references People(PID),
	Password	text		not null,
Primary Key (AID)
);

DROP TABLE IF EXISTS Students;
CREATE TABLE IF NOT EXISTS Students (
	SID			serial		not null	references People(PID),
Primary Key (SID)
);

DROP TABLE IF EXISTS Student_Classes;
CREATE TABLE IF NOT EXISTS Student_Classes (
	DID			serial		not null	references D_Classes(DID),
	SID			serial		not null	references Students(SID),
Primary Key (DID, SID)
);

DROP TABLE IF EXISTS Sessions;
CREATE TABLE IF NOT EXISTS Sessions (
	SesID		text		not null,
	SID			serial		not null	references Students(SID),
Primary Key (SesID, SID)
);