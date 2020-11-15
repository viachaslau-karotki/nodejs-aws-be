SELECT id, title, description, price, count 
FROM products p JOIN stocks s ON p.id = s.product_id 
WHERE p.id = '7567ec4b-b10c-48c5-9345-fc73c48a80a0'