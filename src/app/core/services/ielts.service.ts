import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IeltsTestResult {
  id: string;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  overallScore: number;
  bandScore: number;
  detailedScores?: {
    taskAchievement?: number;
    coherenceCohesion?: number;
    lexicalResource?: number;
    grammaticalRange?: number;
    fluency?: number;
    pronunciation?: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  timeSpent: number;
  createdAt: Date;
}

export interface WritingSubmission {
  task: string;
  writingText: string;
  timeSpent: number;
  taskType: 'task1' | 'task2';
}

export interface SpeakingSubmission {
  questions: string[];
  responses: string[];
  timeSpent: number;
  audioUrl?: string;
}

export interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  targetCountry: string;
  bestScore: number;
  averageScore: number;
  testCount: number;
  lastTestDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class IeltsService {
  private readonly API_URL = 'http://localhost:3000/api/ielts';

  constructor(private http: HttpClient) {}

  submitWritingTest(submission: WritingSubmission): Observable<{ message: string; testResult: IeltsTestResult }> {
    return this.http.post<{ message: string; testResult: IeltsTestResult }>(
      `${this.API_URL}/submit-writing`,
      submission
    );
  }

  submitSpeakingTest(submission: SpeakingSubmission): Observable<{ message: string; testResult: IeltsTestResult }> {
    return this.http.post<{ message: string; testResult: IeltsTestResult }>(
      `${this.API_URL}/submit-speaking`,
      submission
    );
  }

  getTestResults(section?: string, page: number = 1, limit: number = 10): Observable<{
    results: IeltsTestResult[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalResults: number;
    };
  }> {
    const params: any = { page: page.toString(), limit: limit.toString() };
    if (section) params.section = section;

    return this.http.get<{
      results: IeltsTestResult[];
      pagination: any;
    }>(`${this.API_URL}/results`, { params });
  }

  getLeaderboard(section: string = 'overall', limit: number = 50): Observable<{
    leaderboard: LeaderboardEntry[];
  }> {
    return this.http.get<{ leaderboard: LeaderboardEntry[] }>(
      `${this.API_URL}/leaderboard`,
      { params: { section, limit: limit.toString() } }
    );
  }

  getAnalytics(): Observable<{
    monthlyProgress: any[];
    sectionPerformance: any[];
    totalTests: number;
    overallAverage: any[];
  }> {
    return this.http.get<{
      monthlyProgress: any[];
      sectionPerformance: any[];
      totalTests: number;
      overallAverage: any[];
    }>(`${this.API_URL}/analytics`);
  }
}