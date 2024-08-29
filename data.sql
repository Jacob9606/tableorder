SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
00000000-0000-0000-0000-000000000000	47312dbc-0b76-4a67-a58a-94933390cfd9	{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"supabase_admin","actor_via_sso":false,"log_type":"team","traits":{"user_email":"timothyjt96@gmail.com","user_id":"53e93b80-9aa6-4b76-99a6-31d33d762e97"}}	2024-07-29 00:10:01.204187+00	
00000000-0000-0000-0000-000000000000	9a49fe8e-7fd5-43d6-b0d2-e268e80685d7	{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"supabase_admin","actor_via_sso":false,"log_type":"team","traits":{"user_email":"timothyjt96@gmail.com","user_id":"53e93b80-9aa6-4b76-99a6-31d33d762e97"}}	2024-07-29 00:20:23.351854+00	
00000000-0000-0000-0000-000000000000	12fc084e-23df-4ba3-96b2-9e0325b714a1	{"action":"user_signedup","actor_id":"53e93b80-9aa6-4b76-99a6-31d33d762e97","actor_username":"timothyjt96@gmail.com","actor_via_sso":false,"log_type":"team"}	2024-07-29 00:20:40.766305+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	53e93b80-9aa6-4b76-99a6-31d33d762e97	authenticated	authenticated	timothyjt96@gmail.com	$2a$10$nqEEqbYIHewHyp3/skAP6OpeoxgbUpX2jKglbzaM/ShGkF.0KUlay	2024-07-29 00:20:40.766803+00	2024-07-29 00:20:23.352679+00		\N		\N			\N	2024-07-29 00:20:40.770267+00	{"provider": "email", "providers": ["email"]}	{}	\N	2024-07-29 00:10:01.176831+00	2024-07-29 00:20:40.774575+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
53e93b80-9aa6-4b76-99a6-31d33d762e97	53e93b80-9aa6-4b76-99a6-31d33d762e97	{"sub": "53e93b80-9aa6-4b76-99a6-31d33d762e97", "email": "timothyjt96@gmail.com", "email_verified": false, "phone_verified": false}	email	2024-07-29 00:10:01.198924+00	2024-07-29 00:10:01.198976+00	2024-07-29 00:10:01.198976+00	8b161cd8-a838-452e-8f13-3b7bf2059e62
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") FROM stdin;
ebff57db-0893-4a25-bb1b-5dade505bc31	53e93b80-9aa6-4b76-99a6-31d33d762e97	2024-07-29 00:20:40.770332+00	2024-07-29 00:20:40.770332+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	203.10.91.88	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
ebff57db-0893-4a25-bb1b-5dade505bc31	2024-07-29 00:20:40.77501+00	2024-07-29 00:20:40.77501+00	otp	d0c00e3c-72a0-42db-8fda-f8c993771cd5
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	1	XuapGwTN3J5eTJY9Rejs2Q	53e93b80-9aa6-4b76-99a6-31d33d762e97	f	2024-07-29 00:20:40.771967+00	2024-07-29 00:20:40.771967+00	\N	ebff57db-0893-4a25-bb1b-5dade505bc31
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY "pgsodium"."key" ("id", "status", "created", "expires", "key_type", "key_id", "key_context", "name", "associated_data", "raw_key", "raw_key_nonce", "parent_key", "comment", "user_data") FROM stdin;
\.


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."admin" ("id", "email", "password", "shop_name", "phone_number", "address", "email_verified") FROM stdin;
30	snm9606@naver.com	$2a$10$gEzcJAIn9oXyiK/6blxQ1eWy/uXQZ745K2c/pO4m2gr8WVCogOwUK	Illnara2	0414989606	fairy meadow	t
27	timothyjt96@gmail.com	$2a$10$O1YjVXReP.5xD.25wcGM3ePf8lW7llu0iIM8JyksDAG1atTk5D.ny	Hanok	12345678	Northfields	t
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."items" ("id", "name", "price", "description", "image_url", "created_at", "category", "admin_id") FROM stdin;
21	Tangsuyuk	49.00	Korean style sweet and sour pork	https://www.koreanbapsang.com/wp-content/uploads/2011/09/DSC_0113-e1541395731822.jpg	2024-08-10 01:32:11.166737+00	To Share	27
22	Kimchi Udon Jeongol	49.00	Fermented kimchi, thick white noodles	https://i2.wp.com/seonkyounglongest.com/wp-content/uploads/2022/01/web3.jpg?fit=1482%2C2155&ssl=1	2024-08-10 01:33:24.789642+00	To Share	27
23	Haemul-Tang	59.00	Spicy assorted seafood stew. 3 bowls of rice.	https://mealtones.com/cdn/shop/files/a7858775a7f04c3a21e9c0a3cc2b6f31.png?v=1687853328&width=1445	2024-08-10 01:34:19.681824+00	To Share	27
24	Bulgogi Jeongol (small)	38.00	Slice marinated beef hot pot. 2 bowls of rice	https://mykoreankitchen.com/wp-content/uploads/2018/02/2.-Bulgogi-Stew.jpg	2024-08-10 01:36:27.602094+00	To Share	27
25	Gonggi-Bap	3.00	A bowl of rice	https://www.tcmworld.org/wp-content/uploads/2016/08/shutterstock_462377029.jpg	2024-08-10 01:37:07.758861+00	Extra	27
26	Udong-Sari	3.00	Thick white noodles. Udon	https://www.justonecookbook.com/wp-content/uploads/2024/03/Kake-Udon-7549-I-1.jpg	2024-08-10 01:38:25.78798+00	Extra	27
27	Dolsot Bibimbap	20.00	Rice with assorted vegetables in hot stone pot	https://futuredish.com/wp-content/uploads/2017/12/Dolsot-Bibimbap-500x375.jpg	2024-08-10 01:39:54.439522+00	Main	27
28	Kimchi-Jjigae	19.00	Fermented kimchi stew with rice	https://www.koreanbapsang.com/wp-content/uploads/2014/03/DSC5897-2.jpg	2024-08-10 01:40:55.951526+00	Main	27
29	Samgyetang	25.00	Ginseng chicken soup with rice.	https://twoplaidaprons.com/wp-content/uploads/2023/08/side-shot-of-samgyetang-cooked-thumbnail.jpg	2024-08-10 01:42:51.303779+00	Main	27
30	Vege Gunmandu 6pc	10.00	Vegetable fried dumpling 6pc	https://www.maangchi.com/wp-content/uploads/2008/05/fried-dumplings.jpg	2024-08-10 01:44:24.195777+00	Entree	27
31	Kimchi Pancake2	18.00	Fermented kimchi with wheat flour	https://nirarnqszpwmznmykxaf.supabase.co/storage/v1/object/public/items/1724475541667-kimchi pankcake.jpeg	2024-08-10 01:45:16.775857+00	Entree	27
32	Corn Cheese	14.00	Seasoned loose corn covered with seared cheese	https://www.beyondkimchee.com/wp-content/uploads/2023/11/korean-corn-cheese-thumbnail.jpg	2024-08-10 01:45:57.410963+00	Entree	27
33	Steamed eggs	15.00	Steamed eggs in hot pot	https://drivemehungry.com/wp-content/uploads/2021/10/korean-steamed-eggs-gyeran-jjim-13.jpg	2024-08-10 01:46:33.567805+00	Entree	27
36	Chicken wings	12.00	Chicken wings in buffalo sauce	https://nirarnqszpwmznmykxaf.supabase.co/storage/v1/object/public/items/1724393559884-images.jpeg	2024-08-23 06:12:41.553244+00	Entree	27
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."orders" ("item", "price", "status", "id", "created_at", "customer_number", "table_id") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") FROM stdin;
items	items	\N	2024-07-30 06:48:35.371351+00	2024-07-30 06:48:35.371351+00	t	f	\N	\N	\N
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
2da5bf7f-0950-4bd6-aece-f52d10160464	items	public/.emptyFolderPlaceholder	\N	2024-08-01 09:22:30.809721+00	2024-08-01 09:22:30.809721+00	2024-08-01 09:22:30.809721+00	{"eTag": "\\"d41d8cd98f00b204e9800998ecf8427e\\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-01T09:22:31.000Z", "contentLength": 0, "httpStatusCode": 200}	c2a904d8-cb92-4d47-8b4b-62f822d0dc83	\N	\N
d4297c0d-b1ab-4d2f-93eb-fac104e1da47	items	1722505379415-Korean Chciken.jpg	\N	2024-08-01 09:43:03.651169+00	2024-08-01 09:43:03.651169+00	2024-08-01 09:43:03.651169+00	{"eTag": "\\"fab9fb318e94e3a1861f6e88c4c8e4d5\\"", "size": 161628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-01T09:43:04.000Z", "contentLength": 161628, "httpStatusCode": 200}	5c9be595-38d1-4068-9951-99e72b43adf2	\N	\N
a1c2359c-4224-433c-b48e-dee26dd3d58d	items	1722506488098-bibimbap.jpeg	\N	2024-08-01 10:01:32.333774+00	2024-08-01 10:01:32.333774+00	2024-08-01 10:01:32.333774+00	{"eTag": "\\"f869534070bf48d41d954b41dad4d0ee\\"", "size": 9844, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-01T10:01:33.000Z", "contentLength": 9844, "httpStatusCode": 200}	9e8253bc-a0cf-4e73-b3b2-fb19eef0cb05	\N	\N
842f2d2b-a30a-49e0-92cf-d9567941414c	items	1722519258848-Korean Chciken.jpg	\N	2024-08-01 13:34:22.593002+00	2024-08-01 13:34:22.593002+00	2024-08-01 13:34:22.593002+00	{"eTag": "\\"fab9fb318e94e3a1861f6e88c4c8e4d5\\"", "size": 161628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-01T13:34:23.000Z", "contentLength": 161628, "httpStatusCode": 200}	64f57ca4-6b94-4e82-91c0-1ce7a4b91cdd	\N	\N
5c4d1e0a-9f60-424f-8bb6-3b4ada63ec2c	items	1722519520648-Korean Chciken.jpg	\N	2024-08-01 13:38:44.092005+00	2024-08-01 13:38:44.092005+00	2024-08-01 13:38:44.092005+00	{"eTag": "\\"fab9fb318e94e3a1861f6e88c4c8e4d5\\"", "size": 161628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-01T13:38:44.000Z", "contentLength": 161628, "httpStatusCode": 200}	8059865a-defe-463e-a2b4-ff48d91d3621	\N	\N
62909e14-0acf-4949-92d5-e00189106cd9	items	1722570514416-Korean Chciken.jpg	\N	2024-08-02 03:48:38.504186+00	2024-08-02 03:48:38.504186+00	2024-08-02 03:48:38.504186+00	{"eTag": "\\"fab9fb318e94e3a1861f6e88c4c8e4d5\\"", "size": 161628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-02T03:48:39.000Z", "contentLength": 161628, "httpStatusCode": 200}	751dbdca-c01b-4ffc-b2fc-f0b644e7cd02	\N	\N
f0b5df67-4528-43d3-95be-37246f2a8661	items	1722571846027-Korean Chciken.jpg	\N	2024-08-02 04:10:49.859095+00	2024-08-02 04:10:49.859095+00	2024-08-02 04:10:49.859095+00	{"eTag": "\\"fab9fb318e94e3a1861f6e88c4c8e4d5\\"", "size": 161628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-02T04:10:50.000Z", "contentLength": 161628, "httpStatusCode": 200}	da0e99c3-b1de-4539-9ea4-feeb56c400c6	\N	\N
cfd47594-449e-4a38-a3af-ce85bdb50ec0	items	1722579457838-Korean Chciken.jpg	\N	2024-08-02 06:17:42.004566+00	2024-08-02 06:17:42.004566+00	2024-08-02 06:17:42.004566+00	{"eTag": "\\"fab9fb318e94e3a1861f6e88c4c8e4d5\\"", "size": 161628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-02T06:17:42.000Z", "contentLength": 161628, "httpStatusCode": 200}	687a0bc7-d54c-4b4e-972e-48559cc9c70e	\N	\N
4781a5d5-373d-4153-8f6c-2ebb55a48fb8	items	1722579470836-bibimbap.jpeg	\N	2024-08-02 06:17:54.554021+00	2024-08-02 06:17:54.554021+00	2024-08-02 06:17:54.554021+00	{"eTag": "\\"f869534070bf48d41d954b41dad4d0ee\\"", "size": 9844, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-02T06:17:55.000Z", "contentLength": 9844, "httpStatusCode": 200}	8ba02809-c85d-49db-9d96-0f3e56d2092a	\N	\N
2ebd001b-dae1-4a81-9541-ae07c32e5f50	items	1722654027465-bibimbap.jpeg	\N	2024-08-03 03:00:28.0243+00	2024-08-03 03:00:28.0243+00	2024-08-03 03:00:28.0243+00	{"eTag": "\\"f869534070bf48d41d954b41dad4d0ee\\"", "size": 9844, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-03T03:00:28.000Z", "contentLength": 9844, "httpStatusCode": 200}	1237d999-350a-4bd3-a5e6-456c059a7b35	\N	\N
ad2f9c65-1893-41f6-9fe9-bf8621e4746b	items	1722730900502-bibimbap.jpeg	\N	2024-08-04 00:21:43.741269+00	2024-08-04 00:21:43.741269+00	2024-08-04 00:21:43.741269+00	{"eTag": "\\"f869534070bf48d41d954b41dad4d0ee\\"", "size": 9844, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-04T00:21:44.000Z", "contentLength": 9844, "httpStatusCode": 200}	ae3377fe-b190-4347-bcbb-691aa59cb53c	\N	\N
1740afe1-9899-47dc-a82d-7ae8217cb0cd	items	1722730911193-Korean Chciken.jpg	\N	2024-08-04 00:21:54.694236+00	2024-08-04 00:21:54.694236+00	2024-08-04 00:21:54.694236+00	{"eTag": "\\"fab9fb318e94e3a1861f6e88c4c8e4d5\\"", "size": 161628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-04T00:21:55.000Z", "contentLength": 161628, "httpStatusCode": 200}	f92cea4f-69b4-46ae-b3f1-8ea9416aa6ff	\N	\N
3a38b327-64c8-464e-aa3c-6febc47bef96	items	1722732073124-Korean Chciken.jpg	\N	2024-08-04 00:41:16.628737+00	2024-08-04 00:41:16.628737+00	2024-08-04 00:41:16.628737+00	{"eTag": "\\"fab9fb318e94e3a1861f6e88c4c8e4d5\\"", "size": 161628, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-04T00:41:17.000Z", "contentLength": 161628, "httpStatusCode": 200}	16fed8fe-e199-4678-997d-d28d46f6f407	\N	\N
2fa0c345-be33-49df-ba18-73e878265ea5	items	1722732083757-bibimbap.jpeg	\N	2024-08-04 00:41:26.898273+00	2024-08-04 00:41:26.898273+00	2024-08-04 00:41:26.898273+00	{"eTag": "\\"f869534070bf48d41d954b41dad4d0ee\\"", "size": 9844, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-04T00:41:27.000Z", "contentLength": 9844, "httpStatusCode": 200}	c081d5f1-3ce7-4c92-9fad-fe802b56b0d0	\N	\N
121b00b8-bc0e-4359-8cb7-d1cecd365ac3	items	1722991228725-aneta.jpg	\N	2024-08-07 00:40:29.195298+00	2024-08-07 00:40:29.195298+00	2024-08-07 00:40:29.195298+00	{"eTag": "\\"3f242a2d8fd17780cdc5c72216d7c220\\"", "size": 125309, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-07T00:40:30.000Z", "contentLength": 125309, "httpStatusCode": 200}	aa6372c4-02ff-4c2b-b6c3-7d6e8c837d5e	\N	\N
896ce288-1af8-454c-9afd-d3a2c57a8f28	items	1723077073745-mastautim.jpg	\N	2024-08-08 00:31:14.094357+00	2024-08-08 00:31:14.094357+00	2024-08-08 00:31:14.094357+00	{"eTag": "\\"480434b1bde1feb1074830ae13cd713e\\"", "size": 40358, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-08T00:31:15.000Z", "contentLength": 40358, "httpStatusCode": 200}	d45e099e-1a43-44b7-bff1-4abf366868b3	\N	\N
8a8580b8-c82d-481b-8f5c-2f5f4b7ac313	items	1723077131959-Screenshot 2024-07-04 at 14.45.30.png	\N	2024-08-08 00:32:12.79968+00	2024-08-08 00:32:12.79968+00	2024-08-08 00:32:12.79968+00	{"eTag": "\\"993d0f72d4284a2453cd2bd9f971db81\\"", "size": 3471174, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-08-08T00:32:13.000Z", "contentLength": 3471174, "httpStatusCode": 200}	e99ad088-4e96-4f2f-b0b6-a66353710ff1	\N	\N
e58a0baa-1b0b-449d-9a7c-9632f9e393aa	items	1724392651741-images.jpeg	\N	2024-08-23 05:57:32.74278+00	2024-08-23 05:57:32.74278+00	2024-08-23 05:57:32.74278+00	{"eTag": "\\"48ea36fc085f6ebad81487bf282f7581\\"", "size": 9901, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-23T05:57:33.000Z", "contentLength": 9901, "httpStatusCode": 200}	c3ede1d3-9823-4d38-ac0e-7100ed6a62a5	\N	{}
0e90d1ca-b183-4bb7-920a-2f6b94e2d2d8	items	1724392942806-images.jpeg	\N	2024-08-23 06:02:23.80359+00	2024-08-23 06:02:23.80359+00	2024-08-23 06:02:23.80359+00	{"eTag": "\\"48ea36fc085f6ebad81487bf282f7581\\"", "size": 9901, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-23T06:02:24.000Z", "contentLength": 9901, "httpStatusCode": 200}	37adfa4b-d769-4ec8-8816-9c24b49c9b69	\N	{}
c824759b-c8d5-4b4c-ae13-afa71fb08ba8	items	1724393559884-images.jpeg	\N	2024-08-23 06:12:40.81466+00	2024-08-23 06:12:40.81466+00	2024-08-23 06:12:40.81466+00	{"eTag": "\\"48ea36fc085f6ebad81487bf282f7581\\"", "size": 9901, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-23T06:12:41.000Z", "contentLength": 9901, "httpStatusCode": 200}	e1ac52f9-e779-4888-9f8f-e3e229a1cc7d	\N	{}
905b25d1-e197-4664-b686-685087b184ae	items	1724475541667-kimchi pankcake.jpeg	\N	2024-08-24 04:59:05.589412+00	2024-08-24 04:59:05.589412+00	2024-08-24 04:59:05.589412+00	{"eTag": "\\"696453d5d982adf1a998757f0952db65\\"", "size": 13427, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T04:59:06.000Z", "contentLength": 13427, "httpStatusCode": 200}	67fc7192-d1f9-4205-af85-f342f6b1b710	\N	{}
a8c4ed8a-389d-48c6-9efd-6a78bea0221f	items	1724476318543-kimchi pankcake.jpeg	\N	2024-08-24 05:11:59.524528+00	2024-08-24 05:11:59.524528+00	2024-08-24 05:11:59.524528+00	{"eTag": "\\"696453d5d982adf1a998757f0952db65\\"", "size": 13427, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-08-24T05:12:00.000Z", "contentLength": 13427, "httpStatusCode": 200}	bfa315af-ed14-4268-a025-ddcc8e391689	\N	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."admin_id_seq"', 30, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."items_id_seq"', 37, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."orders_id_seq"', 177, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
