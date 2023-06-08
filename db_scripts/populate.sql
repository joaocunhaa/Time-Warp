#Do not change the order or names of states
#(the code is assuming specific IDs and names)
#You can add more in the end
insert into
  game_state (gst_state)
values
  ('Waiting');
insert into
  game_state (gst_state)
values
  ('Started');
insert into
  game_state (gst_state)
values
  ('Finished');
insert into
  game_state (gst_state)
values
  ('Canceled');
#Do not change the order, but you can add more in the end
insert into
  user_game_state (ugst_state)
values
  ('Waiting');
insert into
  user_game_state (ugst_state)
values
  ('Playing');
insert into
  user_game_state (ugst_state)
values
  ('Score');
insert into
  user_game_state (ugst_state)
values
  ('End');
# Cards
insert into
  card(crd_name, crd_description)
values
  (
    'Claim Artifact',
    'This card claims the artifact of the current era'
  );
insert into
  card(crd_name, crd_description)
values
  (
    'Drop Artifact',
    'This card drops a random artifact of the opponent \n in a random position of the board'
  );
insert into
  card(crd_name, crd_description)
values
  (
    'Time Jump',
    'This card skips ahead on the timeline to the next era'
  );
insert into
  card(crd_name, crd_description)
values
  (
    'Time Reverse',
    'This card reverses the board, \n all the players will walk in the reverse direction'
  );
insert into
  card(crd_name, crd_description)
values
  (
    'Paradox',
    'This card creates a paradox by altering the timeline, \n shuffling the artifacts between eras'
  );
insert into
  card(crd_name, crd_description)
values
  (
    'Switch',
    'This card switch your position with the enemy position'
  );
insert into
  card(crd_name, crd_description)
values
  (
    'Action Shield',
    'This card actives a shield that protects you of all effects'
  );
#Eras
insert into
  era(era_name)
values
  ('Egyptian Era');
insert into
  era(era_name)
values
  ('Ancient Greece');
insert into
  era(era_name)
values
  ('Roman Empire');
insert into
  era(era_name)
values
  ('Feudal Japan');
insert into
  era(era_name)
values
  ('Shogunate Era');
insert into
  era(era_name)
values
  ('Second Industrial Revolution');
insert into
  era(era_name)
values
  ('Information Age');
#Artifacts
insert into
  artifact(art_name, art_desc, art_era_id)
values
  (
    'Egyptian Scarab',
    "An old scarab made of gold\n used by Pharaoh",
    1
  );
insert into
  artifact(art_name, art_desc, art_era_id)
values
  (
    'Greece Armor',
    "A rusted armor\n used by a brave greek warrior",
    2
  );
insert into
  artifact(art_name, art_desc, art_era_id)
values
  (
    'Roman Armor',
    "An armor used by\n the strongest gladiator",
    3
  );
insert into
  artifact(art_name, art_desc, art_era_id)
values
  (
    'Samurai Sword',
    "An old Katana used to\n fight against the Empire",
    4
  );
insert into
  artifact(art_name, art_desc, art_era_id)
values
  (
    'Shogun Weapon',
    "The Dagger used by\n Tajihi no Agatamori the first shogun",
    5
  );
insert into
  artifact(art_name, art_desc, art_era_id)
values
  (
    'Industrial Wheels',
    "The first wheels created",
    6
  );
insert into
  artifact(art_name, art_desc, art_era_id)
values
  (
    'Flamethrower',
    "The first flamethrower created\n after the revolution",
    7
  );
insert into
  user(usr_name, usr_pass)
values
  (
    "me",
    "$2b$10$wfN00R4eCvre18IWt6Tiduo0jM6JpZhPHMgyXop4urdTF1zD.JolS"
  );
insert into
  user(usr_name, usr_pass)
values
  (
    "me2",
    "$2b$10$wfN00R4eCvre18IWt6Tiduo0jM6JpZhPHMgyXop4urdTF1zD.JolS"
  );
insert into
  user(usr_name, usr_pass)
values
  (
    "me3",
    "$2b$10$wfN00R4eCvre18IWt6Tiduo0jM6JpZhPHMgyXop4urdTF1zD.JolS"
  );
insert into
  user(usr_name, usr_pass)
values
  (
    "me4",
    "$2b$10$wfN00R4eCvre18IWt6Tiduo0jM6JpZhPHMgyXop4urdTF1zD.JolS"
  );
insert into
  user(usr_name, usr_pass)
values
  (
    "me5",
    "$2b$10$wfN00R4eCvre18IWt6Tiduo0jM6JpZhPHMgyXop4urdTF1zD.JolS"
  );
insert into
  user(usr_name, usr_pass)
values
  (
    "me6",
    "$2b$10$wfN00R4eCvre18IWt6Tiduo0jM6JpZhPHMgyXop4urdTF1zD.JolS"
  );
# Possible end game states
insert into
  scoreboard_state (sbs_state)
values
  ('Tied');
insert into
  scoreboard_state (sbs_state)
values
  ('Lost');
insert into
  scoreboard_state (sbs_state)
values
  ('Won');