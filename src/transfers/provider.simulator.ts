export class ProviderSimulator {
  static async process(): Promise<{
    success: boolean;
    provider_ref?: string;
    error_code?: string;
  }> {
    // simulate delay
    await new Promise((res) => setTimeout(res, 2000));
    const rand = Math.random();
    if (rand < 0.7) {
      return {
        success: true,
        provider_ref:
          'PRV-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
      };
    }
    return { success: false, error_code: 'ERR_PROVIDER_01' };
  }
}
