drop database if exists time_warp;
create database time_warp;

use time_warp;

create table user (
    usr_id int not null auto_increment,
    usr_name varchar(60) not null,
    usr_pass varchar(200) not null, 
    usr_token varchar(200),
    primary key (usr_id));

create table game (
    gm_id int not null auto_increment,
    gm_turn int not null default 1,
    gm_state_id int not null,
    gm_reversed_board boolean default false,
    primary key (gm_id));

create table card(
    crd_id int not null AUTO_INCREMENT,
    crd_name VARCHAR(60) not null,
    crd_description VARCHAR(200),
    primary key(crd_id)
);

create table artifact(
    art_id int not null AUTO_INCREMENT,
    art_name VARCHAR(60) not NULL,
    art_era_id int not null,
    primary key(art_id)
);

create table era(
    era_id int not null AUTO_INCREMENT,
    era_name VARCHAR(60) not null,
    primary key(era_id)
);

create table user_game_card(
    ugc_id int not null AUTO_INCREMENT,
    ugc_ug_id int not null,
    ugc_crd_id int not null,
    primary key(ugc_id)
);

create table game_artifact(
    ga_id int not null AUTO_INCREMENT,
    ga_gm_id int not null,
    ga_art_id int not null,
    ga_current_owner int,
    ga_current_position int,
    primary key(ga_id)
);

create table game_state (
    gst_id int not null auto_increment,
    gst_state varchar(60) not null,
    primary key (gst_id));

create table user_game (
    ug_id int not null auto_increment,
    ug_user_id int not null,
    ug_game_id int not null,
    ug_state_id int not null,
    ug_current_position int not null default 1,
    primary key (ug_id));

create table user_game_state (
    ugst_id int not null auto_increment,
    ugst_state varchar(60) not null,
    primary key (ugst_id));

# Foreign Keys

alter table game add constraint game_fk_match_state
            foreign key (gm_state_id) references game_state(gst_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_user
            foreign key (ug_user_id) references user(usr_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_game
            foreign key (ug_game_id) references game(gm_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_user_game_state
            foreign key (ug_state_id) references user_game_state(ugst_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table artifact add constraint artifact_fk_era
            foreign key (art_era_id) references era(era_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game_card add constraint ugc_fk_ug
            foreign key (ugc_ug_id) references user_game(ug_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game_card add constraint ugc_fk_card
            foreign key (ugc_crd_id) references card(crd_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table game_artifact add constraint ga_fk_gm
            foreign key (ga_gm_id) references game(gm_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table game_artifact add constraint ga_fk_artifact
            foreign key (ga_art_id) references artifact(art_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table game_artifact add constraint ga_fk_ug
            foreign key (ga_current_owner) references user_game(ug_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

select * from game_artifact, artifact where ga_art_id = art_id and ga_current_owner is null and ga_gm_id = 1;