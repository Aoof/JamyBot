CREATE SCHEMA royalbutler;
CREATE TABLE royalbutler.orders
(
    orderid integer NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
    userid character varying(200) COLLATE pg_catalog."default",
    itemid integer,
    msg character varying(500) COLLATE pg_catalog."default",
    CONSTRAINT orders_itemid FOREIGN KEY (itemid)
        REFERENCES royalbutler.store (itemid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT orders_userid FOREIGN KEY (userid)
        REFERENCES royalbutler.users (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);
CREATE TABLE royalbutler.store
(
    itemid integer NOT NULL DEFAULT nextval('store_itemid_seq'::regclass),
    name character varying(300) COLLATE pg_catalog."default" NOT NULL,
    price integer DEFAULT 0,
    CONSTRAINT store_pkey PRIMARY KEY (itemid),
    CONSTRAINT store_name_key UNIQUE (name)
);
CREATE TABLE royalbutler.tcommands
(
    id integer NOT NULL DEFAULT nextval('tcommands_id_seq'::regclass),
    command character varying(50) COLLATE pg_catalog."default" NOT NULL,
    reply character varying(400) COLLATE pg_catalog."default" NOT NULL,
    "desc" character varying(500) COLLATE pg_catalog."default",
    CONSTRAINT tcommands_pkey PRIMARY KEY (id),
    CONSTRAINT tcommands_command_key UNIQUE (command)
);
CREATE TABLE royalbutler.userdata
(
    userdataid integer NOT NULL DEFAULT nextval('userdata_userdataid_seq'::regclass),
    goldeggs integer DEFAULT 0,
    plateggs integer DEFAULT 0,
    points integer DEFAULT 0,
    userid character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT userdata_pkey PRIMARY KEY (userdataid, userid),
    CONSTRAINT userdata_userid_key UNIQUE (userid)
);
CREATE TABLE royalbutler.users
(
    userid character varying(50) COLLATE pg_catalog."default" NOT NULL,
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    displayname character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    badgesraw character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    room_id character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    moderator boolean DEFAULT false,
    subscriber boolean DEFAULT false,
    "password" character varying(200) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    CONSTRAINT users_pkey PRIMARY KEY (userid),
    CONSTRAINT users_displayname_key UNIQUE (displayname)
);