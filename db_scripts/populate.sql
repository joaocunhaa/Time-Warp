#Do not change the order or names of states 
#(the code is assuming specific IDs and names)
#You can add more in the end
insert into game_state (gst_state) values ('Waiting');
insert into game_state (gst_state) values ('Started');
insert into game_state (gst_state) values ('Finished');
insert into game_state (gst_state) values ('Canceled');
insert into game_state (gst_state) values ('Surrendered');

#Do not change the order, but you can add more in the end
insert into user_game_state (ugst_state) values ('Waiting');
insert into user_game_state (ugst_state) values ('Playing');
insert into user_game_state (ugst_state) values ('End');

# Cards
insert into card(crd_name, crd_description) values ('Claim Artifact', 'This card claims the artifact of the current era');
insert into card(crd_name, crd_description) values ('Steal Artifact', 'This card steals a random artifact of the opponent');
insert into card(crd_name, crd_description) values ('Time Jump', 'This card skips ahead on the timeline to the next era');
insert into card(crd_name, crd_description) values ('Time Reverse', 'This card reverses the board, now, all the players walk in the reverse direction');

-- insert into card(crd_name, crd_description) values ('Time Loop', 'This card skips the opponent’s turn and you play twice in a row');

insert into card(crd_name, crd_description) values ('Paradox', 'This card creates a paradox by altering the timeline, shuffling the artifacts between eras');

#Eras
insert into era(era_name) values ('Egyptian Era');
insert into era(era_name) values ('Ancient Greece');
insert into era(era_name) values ('Roman Empire');
insert into era(era_name) values ('Feudal Japan');
insert into era(era_name) values ('Shogunate Era');
insert into era(era_name) values ('Second Industrial Revolution');
insert into era(era_name) values ('Information Age');

#Artifacts
insert into artifact(art_name, art_era_id) values ('Egyptian Scarab',1);
insert into artifact(art_name, art_era_id) values ('Greece Armor',2);
insert into artifact(art_name, art_era_id) values ('Roman Armor',3);
insert into artifact(art_name, art_era_id) values ('Samurai Sword',4);
insert into artifact(art_name, art_era_id) values ('Shogun Weapon',5);
insert into artifact(art_name, art_era_id) values ('Industrial Wheels',6);
insert into artifact(art_name, art_era_id) values ('Flamethrower',7);
--insert into user_game_card(ugc_ug_id, ugc_crd_id) values (1,2);