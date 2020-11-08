CREATE TABLE IF NOT EXISTS products(
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title text,
	description text,
	price NUMERIC(6, 1)
);

CREATE TABLE IF NOT EXISTS stocks(
	product_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	count integer,
 FOREIGN KEY(product_id) REFERENCES products(id)
);

INSERT INTO products (id, title, description, price) VALUES
('7567ec4b-b10c-48c5-9345-fc73c48a80aa','Android Tablet 10 Inch','Android Tablet 10 Inch, 3G Phablet, Android 8.1 Go, GMS Certified, Dual SIM Card Slots and Cameras, 16GB, Bluetooth, 2.4G WiFi, GPS, OTG',99.9),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0','10 inch Android Google Tablet','10 inch Android Google Tablet, Android 9.0 Pie, GMS Certified, 2GB RAM, 32GB Storage, Quad-Core Processor, IPS HD Display, Wi-Fi, Bluetooth, GPS',105.6),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2','Haehne 7 inch Tablet','Haehne 7 inch Tablet, Android 6.0, Quad Core Processor, 1G RAM 16GB Storage, IPS HD Display, Dual Camera, FM, WiFi Only, Bluetooth, Blue',90.1),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1','Dragon Touch Notepad 102','Dragon Touch Notepad 102, 10-inch Tablet, Android 10, Octa-Core Processor, 3GB RAM, 32GB ROM, IPS HD Display, Bluetooth 5.0, 5G WiFi, GPS, Metal Body, Gray',86.1),
('7567ec4b-b10c-48c5-9345-fc73348a80a1','Microsoft Surface Pro 7','Microsoft Surface Pro 7: 10th Gen i3-1005G1, 4GB RAM, 128GB SSD, 12.3 PixelSense Touch Display (2736x1824), Includes Type Cover',123.9),
('7567ec4b-b10c-48c5-9445-fc73c48a80a2','Vanquisher 8-Inch Industrial Rugged Tablet PC','Vanquisher 8-Inch Industrial Rugged Tablet PC, Windows 10 Pro/GPS GNSS / 4G LTE/Drop Survival, for Enterprise Field Mobility',73.4),
('7567ec4b-b10c-45c5-9345-fc73c48a80a1','Haehne 7 inch Tablet','Haehne 7 inch Tablet, Android 9.0 Pie, 1G RAM 16GB Storage, Quad Core Processor, 7 IPS HD Display, Dual Camera, FM, WiFi Only, Bluetooth, Blue',60.9);

INSERT INTO stocks (product_id, count) VALUES
('7567ec4b-b10c-48c5-9345-fc73c48a80aa',91),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0',10),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2',52),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1',32),
('7567ec4b-b10c-48c5-9345-fc73348a80a1',40),
('7567ec4b-b10c-48c5-9445-fc73c48a80a2',5),
('7567ec4b-b10c-45c5-9345-fc73c48a80a1',18)
