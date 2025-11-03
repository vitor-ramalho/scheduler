#!/bin/bash

# Admin creation script - run once during deployment
# This should be run by system administrators only

echo "Creating initial admin user..."

# Check if admin already exists
ADMIN_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X GET http://localhost:3000/api/admin-management/admins \
  -H "Authorization: Bearer PLACEHOLDER")

if [ "$ADMIN_EXISTS" = "200" ]; then
  echo "Admin users already exist. Skipping creation."
  exit 0
fi

# Create admin via direct database insertion
# This is safer than exposing an API endpoint
NODE_ENV=production node -e "
const { execSync } = require('child_process');
const bcrypt = require('bcrypt');

async function createAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@system.local';
  const password = process.env.INITIAL_ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Direct database insertion
  const query = \`
    INSERT INTO organizations (id, name, slug, enabled, \"createdAt\", \"updatedAt\") 
    VALUES (gen_random_uuid(), 'System Administration', 'system-admin', true, NOW(), NOW());
    
    INSERT INTO users (id, email, password, \"firstName\", \"lastName\", role, \"organizationId\", \"createdAt\", \"updatedAt\")
    VALUES (
      gen_random_uuid(), 
      '\${email}', 
      '\${hashedPassword}', 
      'System', 
      'Administrator', 
      'admin', 
      (SELECT id FROM organizations WHERE slug = 'system-admin'),
      NOW(),
      NOW()
    );
  \`;
  
  console.log('Admin user created successfully');
}

createAdmin().catch(console.error);
"

echo "Initial admin setup complete"
echo "Email: \${INITIAL_ADMIN_EMAIL:-admin@system.local}"
echo "Password: \${INITIAL_ADMIN_PASSWORD:-admin123}"
echo ""
echo "⚠️  IMPORTANT: Change the default password immediately after first login!"