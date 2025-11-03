// Traduções para mensagens de erro do backend
export const ERROR_TRANSLATIONS = {
  'pt-BR': {
    'Email already in use': 'Email já está em uso',
    'User not found': 'Usuário não encontrado', 
    'Invalid credentials': 'Credenciais inválidas',
    'Password too weak': 'Senha muito fraca',
    'Invalid email format': 'Formato de email inválido',
    'Organization name already exists': 'Nome da organização já existe',
    'Registration failed': 'Erro no cadastro',
    'Login failed': 'Erro no login',
    'Unauthorized': 'Não autorizado',
    'Forbidden': 'Acesso negado',
    'Bad Request': 'Requisição inválida',
    'Internal Server Error': 'Erro interno do servidor',
    'Network Error': 'Erro de conexão'
  },
  'en-US': {
    'Email already in use': 'Email already in use',
    'User not found': 'User not found',
    'Invalid credentials': 'Invalid credentials', 
    'Password too weak': 'Password too weak',
    'Invalid email format': 'Invalid email format',
    'Organization name already exists': 'Organization name already exists',
    'Registration failed': 'Registration failed',
    'Login failed': 'Login failed',
    'Unauthorized': 'Unauthorized',
    'Forbidden': 'Forbidden',
    'Bad Request': 'Bad Request',
    'Internal Server Error': 'Internal Server Error',
    'Network Error': 'Network Error'
  }
};

export function translateError(message: string, locale: string = 'pt-BR'): string {
  const translations = ERROR_TRANSLATIONS[locale as keyof typeof ERROR_TRANSLATIONS];
  return translations?.[message as keyof typeof translations] || message;
}