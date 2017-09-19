-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2017-09-11 16:49:16.447

DROP DATABASE IF EXISTS flowcharts ;
CREATE DATABASE flowcharts;
USE flowcharts;
-- tables
-- Table: flowcharts
CREATE TABLE flowcharts (
    title varchar(25) NOT NULL,
    users_username varchar(25) NOT NULL,
    model varchar(10000) NOT NULL,
    color varchar(25),
    CONSTRAINT flowcharflts_pk PRIMARY KEY (title)
);

-- Table: linkDataArray
CREATE TABLE linkDataArray (
    `from` real(2,2) NOT NULL,
    `to` real(2,2) NOT NULL,
    flowcharts_title varchar(25) NOT NULL,
    CONSTRAINT linkDataArray_pk PRIMARY KEY (`from`)
);

-- Table: nodeDataArray
CREATE TABLE nodeDataArray (
    category int NOT NULL,
    text varchar(25) NOT NULL,
    figure varchar(25) NOT NULL,
    `key` real(3,3) NOT NULL,
    loc varchar(25) NOT NULL,
    flowcharts_title varchar(25) NOT NULL,
    CONSTRAINT nodeDataArray_pk PRIMARY KEY (category)
);

-- Table: points
CREATE TABLE points (
    point real(3,3) NOT NULL,
    linkDataArray_from real(2,2) NOT NULL,
    CONSTRAINT points_pk PRIMARY KEY (point)
);

-- Table: users
CREATE TABLE users (
    username varchar(25) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(25) NOT NULL,
    CONSTRAINT users_pk PRIMARY KEY (username)
);

-- foreign keys
-- Reference: flowcharts_users (table: flowcharts)
ALTER TABLE flowcharts ADD CONSTRAINT flowcharts_users FOREIGN KEY flowcharts_users (users_username)
    REFERENCES users (username);

-- Reference: linkDataArray_flowcharts (table: linkDataArray)
ALTER TABLE linkDataArray ADD CONSTRAINT linkDataArray_flowcharts FOREIGN KEY linkDataArray_flowcharts (flowcharts_title)
    REFERENCES flowcharts (title);

-- Reference: nodeDataArray_flowcharts (table: nodeDataArray)
ALTER TABLE nodeDataArray ADD CONSTRAINT nodeDataArray_flowcharts FOREIGN KEY nodeDataArray_flowcharts (flowcharts_title)
    REFERENCES flowcharts (title);

-- Reference: points_linkDataArray (table: points)
ALTER TABLE points ADD CONSTRAINT points_linkDataArray FOREIGN KEY points_linkDataArray (linkDataArray_from)
    REFERENCES linkDataArray (`from`);

-- End of file.
