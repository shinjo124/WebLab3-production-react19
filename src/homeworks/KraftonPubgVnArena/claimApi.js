export function mockClaimCrate() {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() < 0.25) {
        const error = new Error('Crate is already looted.');
        error.status = 409;
        reject(error);
        return;
      }
      resolve({ claimed: true });
    }, 350);
  });
}