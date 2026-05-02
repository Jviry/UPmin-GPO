import { DomainError } from './errors.js';

export function validateTestimony(id) {
    if (!id) {
        throw new DomainError('Testimony ID is required');
    }
    if (isNaN(id)) {
        throw new DomainError('Invalid Testimony ID');
    }
}