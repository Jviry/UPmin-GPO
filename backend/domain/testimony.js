import { DomainError } from './errors.js';

export function validateTestimonyId(id) {
    if (!id) {
        throw new DomainError('Testimony ID is required');
    }
    if (isNaN(id)) {
        throw new DomainError('Invalid Testimony ID');
    }
}