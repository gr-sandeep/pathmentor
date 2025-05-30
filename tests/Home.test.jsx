import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/components/Home';
import axios from 'axios';

jest.mock('axios');

const mockRoadmap = [
  { phase: 'Phase 1', description: 'Learn basics' },
  { phase: 'Phase 2', description: 'Build projects' },
];

describe('Home Component - Roadmap Generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields and generate button', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText(/eg\. frontend developer/i)).toBeInTheDocument();
    expect(screen.getByText(/generate roadmap/i)).toBeInTheDocument();
  });

  it('calls API and renders roadmap on success', async () => {
    axios.post.mockResolvedValue({
      data: {
        choices: [
          { message: { content: JSON.stringify(mockRoadmap) } }
        ]
      }
    });
    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText(/eg\. frontend developer/i), { target: { value: 'Frontend Developer' } });
    fireEvent.click(screen.getByText(/generate roadmap/i));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(screen.getByText(/phase 1/i)).toBeInTheDocument();
      expect(screen.getByText(/learn basics/i)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    axios.post.mockRejectedValue(new Error('API Error'));
    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText(/eg\. frontend developer/i), { target: { value: 'Frontend Developer' } });
    fireEvent.click(screen.getByText(/generate roadmap/i));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      // Optionally, check for error message or no roadmap rendered
    });
  });
}); 