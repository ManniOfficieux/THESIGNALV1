import { calculateGrade } from '../domain/grades';

test('grade progression', () => {
  expect(calculateGrade(0).name).toBe('Initié');
  expect(calculateGrade(3).name).toBe('Adepte');
  expect(calculateGrade(6).name).toBe('Architecte');
  expect(calculateGrade(9).name).toBe('Maître');
});
