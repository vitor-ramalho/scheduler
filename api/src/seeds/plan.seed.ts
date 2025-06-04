import { DataSource } from 'typeorm';
import { Plan } from '../plans/entities/plan.entity';

export const seedPlans = async (dataSource: DataSource): Promise<void> => {
  const planRepository = dataSource.getRepository(Plan);
  
  // Check if plans already exist
  const existingPlans = await planRepository.count();
  if (existingPlans > 0) {
    console.log('Plans already seeded, skipping...');
    return;
  }
  
  // Define your plans
  const plans = [
    {
      name: 'Essential',
      description: 'Perfect for solo practitioners and freelancers',
      price: 29.99,
      features: [
        'Up to 50 appointments/month', 
        'Basic scheduling', 
        'Email notifications',
        'Client management',
        'Calendar integration',
        'Basic reporting'
      ],
      interval: 'month',
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses and professionals',
      price: 59.99,
      features: [
        'Unlimited appointments', 
        'Advanced scheduling with custom time slots', 
        'Email and SMS notifications',
        'Enhanced client management',
        'Online payments',
        'Advanced reporting',
        'Customizable booking page',
        '1 additional staff member'
      ],
      interval: 'month',
    },
    {
      name: 'Business',
      description: 'Complete solution for established businesses',
      price: 99.99,
      features: [
        'Unlimited appointments',
        'All Professional features',
        'Up to 5 staff members',
        'Advanced analytics dashboard',
        'Custom branding',
        'Priority support',
        'Client mobile app',
        'API access',
        'Dedicated account manager'
      ],
      interval: 'month',
    }
  ];
  
  // Insert plans
  const savedPlans = await planRepository.save(plans);
  console.log(`Seeded ${savedPlans.length} plans`);
};
