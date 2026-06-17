--
-- PostgreSQL database dump
--

\restrict pzY9gk3g6aCyGCCiIhikeh2ce684SEcFWCiPGFx4ZwHnIQ7gpcYZpAHU5oN5RCh

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg12+1)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_notifications (
    id integer NOT NULL,
    order_id integer,
    viewed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: admin_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_notifications_id_seq OWNED BY public.admin_notifications.id;


--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(20),
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer,
    origin text NOT NULL,
    destination text NOT NULL,
    description text,
    price numeric(10,2) DEFAULT 0,
    status character varying(50) DEFAULT 'Pendiente'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    origin_address text,
    destination_address text,
    origin_lat numeric(10,8),
    origin_lng numeric(11,8),
    destination_lat numeric(10,8),
    destination_lng numeric(11,8),
    price_type character varying(20) DEFAULT 'fixed'::character varying,
    distance_km numeric(10,2) DEFAULT 0
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotions (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.promotions_id_seq OWNED BY public.promotions.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    price_type character varying(20) DEFAULT 'fixed'::character varying,
    price_per_km numeric(10,2) DEFAULT 0
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: admin_notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notifications ALTER COLUMN id SET DEFAULT nextval('public.admin_notifications_id_seq'::regclass);


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: promotions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotions ALTER COLUMN id SET DEFAULT nextval('public.promotions_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Data for Name: admin_notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_notifications (id, order_id, viewed, created_at) FROM stdin;
1	39	t	2026-06-15 22:01:47.819111
2	40	t	2026-06-15 22:17:55.740868
3	41	f	2026-06-16 06:55:48.961913
4	42	f	2026-06-16 06:57:39.905457
5	43	f	2026-06-16 07:24:05.377976
6	44	f	2026-06-16 08:26:52.19851
7	45	f	2026-06-16 08:27:07.671024
8	46	f	2026-06-16 18:48:59.218509
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (id, name, email, password, created_at) FROM stdin;
1	Engel	admin@rutaexpress.com	$2b$10$mDHith5duvBElyefk02QVOqFyOQglAFsqKtG52PAg.n80SBP8Lvae	2026-06-13 08:18:18.258877
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customers (id, name, phone, email, password, created_at) FROM stdin;
1	Cliente Prueba	86109523	cliente@test.com	$2b$10$bQvqbT1BdZNyxtbahMLdou3/a/NU7yx3a1kIB4qCP.4vrCV3ROMy.	2026-06-13 03:14:54.978816
3	engel martinez	888999888	engelcexs@gmail.com	$2b$10$Ut4Ili5R3V89BBgVm/L3oOl0qW/qfCnZxvX32oGem5w6YkPVn.mEa	2026-06-13 09:53:21.887376
4	engel martinez	89665957	engel2@test.com	$2b$10$wzoBhqwXBqzOAV9b.VoJ1.LtyeZIphdnCtCJPfMrwpVEOcoNTnGuW	2026-06-13 19:54:40.004217
5	engel martinez	89665957	engel7@test.com	$2b$10$UjdFM1lx1w2GKJbvrOvtPu1U0dpo8TPZaDJ4ZWnkyMlHxDQfcSg6C	2026-06-13 20:44:13.577356
6	engel martinez	754757554	engelcexsjjjj@gmail.com	$2b$10$KEJ/SmODL5HE.tFrZ0nToudrAu6kwQe9HPjkiXj9Z69xKpq9JiENq	2026-06-13 20:51:35.157307
2	Engel Martinez	86109524	engel@test.com	$2b$10$F1B9ri/Tog8.XOAFgVAxjuy7/EsLHjTf/OoNiuZwrioquB7Qeue4i	2026-06-13 07:54:32.100576
8	Nestor 	84853284	nestor@test.com	$2b$10$/LmKgPH.ZFM4jw3fPhLl9uNsVT9gXUVNuGJGPn6n8PXJ9aAJIzCOa	2026-06-16 07:14:36.331538
7	belén	89665957	maricela2@test.com	$2b$10$wthgWpM50ASM4vuB7LuIA.Wozba6EUfxCKTwHgx4n0Lxd2e/0ynKG	2026-06-14 08:26:58.905692
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, customer_id, origin, destination, description, price, status, created_at, origin_address, destination_address, origin_lat, origin_lng, destination_lat, destination_lng, price_type, distance_km) FROM stdin;
9	7	diriamba	jinotepe	Servicio: diriamba - Jinotepe. quiero	100.00	Cancelado	2026-06-14 19:23:28.045894	diriamba	jinotepe	\N	\N	\N	\N	fixed	0.00
12	4	Ubicación actual seleccionada	mined managua	Servicio: Managua. Sin descripción adicional.	328.00	Pendiente	2026-06-14 19:44:48.824291	Ubicación actual seleccionada	mined managua	11.85219816	-86.23552687	\N	\N	distance	32.80
2	3	diriamba	jinotepe	traer un arroz con lechec	15.00	Pendiente	2026-06-13 09:54:33.986288	\N	\N	\N	\N	\N	\N	fixed	0.00
3	4	diriamba	jinotepe	vggdfbvefgdergvergfve	11.00	Pendiente	2026-06-13 20:57:35.132214	\N	\N	\N	\N	\N	\N	fixed	0.00
1	2	Diriamba	Jinotepe	Retirar paquete pequeño	100.00	Cancelado	2026-06-13 08:00:07.000828	\N	\N	\N	\N	\N	\N	fixed	0.00
4	4	diriamba	managua	bhbkhvkvguhvukgvtv	5555.00	Entregado	2026-06-14 08:25:05.009648	\N	\N	\N	\N	\N	\N	fixed	0.00
34	7	Ubicación actual seleccionada	diriamba	Servicio: diriamba - Jinotepe. mnlkjnn l	100.00	Cancelado	2026-06-15 20:20:59.350412	Ubicación actual seleccionada	diriamba	11.85218361	-86.23554666	\N	\N	fixed	0.00
45	7	Ubicación actual seleccionada	diriamba	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Entregado	2026-06-16 08:27:07.551017	Ubicación actual seleccionada	diriamba	11.85219301	-86.23553934	\N	\N	fixed	0.00
44	7	Ubicación actual seleccionada	mined managua	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	En camino	2026-06-16 08:26:52.079411	Ubicación actual seleccionada	mined managua	11.85219301	-86.23553934	\N	\N	fixed	0.00
43	8	Ubicación actual seleccionada	managua	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Recibido	2026-06-16 07:24:05.252636	Ubicación actual seleccionada	managua	11.85219255	-86.23554418	\N	\N	fixed	0.00
42	7	Ubicación actual seleccionada	mined managua	Servicio: Managua. Sin descripción adicional.	880.00	En camino	2026-06-16 06:57:39.777948	Ubicación actual seleccionada	mined managua	11.85219255	-86.23554418	\N	\N	distance	88.00
41	7	Ubicación actual seleccionada	managua	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Entregado	2026-06-16 06:55:48.837572	Ubicación actual seleccionada	managua	11.85219255	-86.23554418	\N	\N	fixed	0.00
46	8	Ubicación actual seleccionada	jinotepe	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Recibido	2026-06-16 18:48:59.099734	Ubicación actual seleccionada	jinotepe	11.85219301	-86.23553934	\N	\N	fixed	0.00
40	7	Ubicación actual seleccionada	jinotepe	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Cancelado	2026-06-15 22:17:55.621222	Ubicación actual seleccionada	jinotepe	11.85217001	-86.23557664	\N	\N	fixed	0.00
38	7	Ubicación actual seleccionada	mined managua	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Cancelado	2026-06-15 20:25:49.884036	Ubicación actual seleccionada	mined managua	11.85218432	-86.23555425	\N	\N	fixed	0.00
39	7	Ubicación actual seleccionada	managua	Servicio: Managua. Sin descripción adicional.	234.00	Cancelado	2026-06-15 22:01:47.700986	Ubicación actual seleccionada	managua	11.85218432	-86.23555425	\N	\N	distance	23.40
37	7	Ubicación actual seleccionada	jinotepe	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Cancelado	2026-06-15 20:22:34.608478	Ubicación actual seleccionada	jinotepe	11.85219816	-86.23552687	\N	\N	fixed	0.00
36	7	Ubicación actual seleccionada	managua	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Cancelado	2026-06-15 20:21:57.895156	Ubicación actual seleccionada	managua	11.85219816	-86.23552687	\N	\N	fixed	0.00
35	7	Ubicación actual seleccionada	diriamba	Servicio: diriamba - Jinotepe. Sin descripción adicional.	100.00	Cancelado	2026-06-15 20:21:29.361846	Ubicación actual seleccionada	diriamba	11.85218361	-86.23554666	\N	\N	fixed	0.00
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotions (id, title, description, active, created_at) FROM stdin;
3	4to viaje gratis	por ser un cliente frecuente	t	2026-06-14 12:37:10.256583
4	viaje 	qfqewfeqwfcqacaqdqw	t	2026-06-16 20:24:18.348993
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, name, price, active, created_at, price_type, price_per_km) FROM stdin;
9	Managua	200.00	t	2026-06-14 23:09:02.15599	distance	10.00
10	diriamba - Jinotepe	100.00	t	2026-06-15 01:22:34.478152	fixed	0.00
\.


--
-- Name: admin_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_notifications_id_seq', 8, true);


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_id_seq', 8, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 46, true);


--
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.promotions_id_seq', 4, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 10, true);


--
-- Name: admin_notifications admin_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_pkey PRIMARY KEY (id);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: admin_notifications admin_notifications_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- PostgreSQL database dump complete
--

\unrestrict pzY9gk3g6aCyGCCiIhikeh2ce684SEcFWCiPGFx4ZwHnIQ7gpcYZpAHU5oN5RCh

