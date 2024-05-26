create database app;

\c app

create schema if not exists cccat15;

create table if not exists cccat15.account (
    account_id uuid primary key,
    name text not null,
    email text not null,
    cpf text not null,
    car_plate text null,
    is_passenger boolean not null default false,
    is_driver boolean not null default false
);