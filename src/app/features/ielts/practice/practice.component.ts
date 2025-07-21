import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { IeltsService, WritingSubmission, SpeakingSubmission, IeltsTestResult } from '../../../core/services/ielts.service';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, ReactiveFormsModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            IELTS {{ currentSection | titlecase }} Practice
          </h1>
          <p class="text-gray-600">
            {{ getSectionDescription() }}
          </p>
        </div>

        <!-- Writing Practice -->
        <div *ngIf="currentSection === 'writing'" class="card">
          <div class="card-header">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Writing Task {{ selectedTask }}</h2>
              <div class="flex items-center space-x-4">
                <button 
                  (click)="selectedTask = 1"
                  [class]="selectedTask === 1 ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'">
                  Task 1
                </button>
                <button 
                  (click)="selectedTask = 2"
                  [class]="selectedTask === 2 ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'">
                  Task 2
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-body">
            <!-- Timer -->
            <div class="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
              <div class="text-sm text-blue-700">
                <strong>Time Limit:</strong> {{ selectedTask === 1 ? '20 minutes' : '40 minutes' }}
              </div>
              <div class="text-lg font-bold text-blue-800">
                {{ formatTime(timeElapsed) }}
              </div>
            </div>

            <!-- Task Instructions -->
            <div class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <h3 class="font-semibold text-yellow-800 mb-2">Task Instructions:</h3>
              <p class="text-yellow-700 text-sm">{{ getTaskInstructions() }}</p>
            </div>

            <!-- Writing Form -->
            <form [formGroup]="writingForm" (ngSubmit)="submitWritingTest()" *ngIf="!isSubmitting && !testResult">
              <div class="form-group">
                <label class="form-label">Your Response:</label>
                <textarea 
                  formControlName="writingText"
                  class="form-control"
                  rows="15"
                  placeholder="Start writing your response here..."
                  (input)="updateWordCount()"
                  [class.is-invalid]="writingForm.get('writingText')?.invalid && writingForm.get('writingText')?.touched">
                </textarea>
                <div class="flex justify-between items-center mt-2">
                  <div class="text-sm text-gray-500">
                    Words: {{ wordCount }} / {{ selectedTask === 1 ? '150 minimum' : '250 minimum' }}
                  </div>
                  <div *ngIf="writingForm.get('writingText')?.invalid && writingForm.get('writingText')?.touched" 
                       class="invalid-feedback">
                    Please write your response
                  </div>
                </div>
              </div>

              <div class="flex justify-between items-center">
                <button type="button" (click)="resetTest()" class="btn btn-secondary">
                  Reset
                </button>
                <button 
                  type="submit" 
                  [disabled]="writingForm.invalid || wordCount < (selectedTask === 1 ? 150 : 250)"
                  class="btn btn-primary">
                  Submit for AI Evaluation
                </button>
              </div>
            </form>

            <!-- Loading State -->
            <div *ngIf="isSubmitting" class="text-center py-12">
              <div class="spinner mx-auto mb-4" style="width: 2rem; height: 2rem;"></div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Evaluating Your Response</h3>
              <p class="text-gray-600">Our AI is analyzing your writing. This may take a few moments...</p>
            </div>

            <!-- Test Results -->
            <div *ngIf="testResult && !isSubmitting" class="space-y-6">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <span class="text-3xl font-bold text-green-600">{{ testResult.overallScore }}</span>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Band Score: {{ testResult.overallScore }}/9</h3>
                <p class="text-gray-600">{{ getBandDescription(testResult.overallScore) }}</p>
              </div>

              <!-- Detailed Scores -->
              <div class="grid md:grid-cols-2 gap-4" *ngIf="testResult.detailedScores">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="text-2xl font-bold text-blue-600 mb-1">
                      {{ testResult.detailedScores.taskAchievement || testResult.detailedScores.fluency || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ selectedTask === 1 ? 'Task Achievement' : 'Task Response' }}
                    </div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body text-center">
                    <div class="text-2xl font-bold text-green-600 mb-1">
                      {{ testResult.detailedScores.coherenceCohesion || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">Coherence & Cohesion</div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body text-center">
                    <div class="text-2xl font-bold text-purple-600 mb-1">
                      {{ testResult.detailedScores.lexicalResource || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">Lexical Resource</div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body text-center">
                    <div class="text-2xl font-bold text-orange-600 mb-1">
                      {{ testResult.detailedScores.grammaticalRange || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">Grammar & Accuracy</div>
                  </div>
                </div>
              </div>

              <!-- Feedback -->
              <div class="card">
                <div class="card-header">
                  <h4 class="font-semibold text-gray-900">Detailed Feedback</h4>
                </div>
                <div class="card-body">
                  <p class="text-gray-700 mb-4">{{ testResult.feedback }}</p>
                  
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 class="font-semibold text-green-700 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Strengths
                      </h5>
                      <ul class="space-y-2">
                        <li *ngFor="let strength of testResult.strengths" 
                            class="text-sm text-gray-700 flex items-start">
                          <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {{ strength }}
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 class="font-semibold text-orange-700 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Areas for Improvement
                      </h5>
                      <ul class="space-y-2">
                        <li *ngFor="let improvement of testResult.improvements" 
                            class="text-sm text-gray-700 flex items-start">
                          <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {{ improvement }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recommendations -->
              <div class="card">
                <div class="card-header">
                  <h4 class="font-semibold text-gray-900">Recommendations</h4>
                </div>
                <div class="card-body">
                  <ul class="space-y-3">
                    <li *ngFor="let recommendation of testResult.recommendations" 
                        class="text-sm text-gray-700 flex items-start">
                      <svg class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      {{ recommendation }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center space-x-4">
                <button (click)="resetTest()" class="btn btn-secondary">
                  Try Again
                </button>
                <a routerLink="/ielts/results" class="btn btn-primary">
                  View All Results
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Speaking Practice -->
        <div *ngIf="currentSection === 'speaking'" class="card">
          <div class="card-header">
            <h2 class="text-xl font-semibold text-gray-900">Speaking Practice</h2>
          </div>
          
          <div class="card-body">
            <!-- Timer -->
            <div class="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
              <div class="text-sm text-blue-700">
                <strong>Time Limit:</strong> 11-14 minutes
              </div>
              <div class="text-lg font-bold text-blue-800">
                {{ formatTime(timeElapsed) }}
              </div>
            </div>

            <!-- Speaking Questions -->
            <div *ngIf="!isSubmitting && !testResult" class="space-y-6">
              <div *ngFor="let question of speakingQuestions; let i = index" class="card">
                <div class="card-header">
                  <h4 class="font-semibold text-gray-900">Question {{ i + 1 }}</h4>
                </div>
                <div class="card-body">
                  <p class="text-gray-700 mb-4">{{ question }}</p>
                  <div class="form-group">
                    <label class="form-label">Your Response:</label>
                    <textarea 
                      [(ngModel)]="speakingResponses[i]"
                      class="form-control"
                      rows="4"
                      placeholder="Type your spoken response here...">
                    </textarea>
                  </div>
                </div>
              </div>

              <div class="text-center">
                <button 
                  (click)="submitSpeakingTest()" 
                  [disabled]="!canSubmitSpeaking()"
                  class="btn btn-primary btn-lg">
                  Submit for AI Evaluation
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="isSubmitting" class="text-center py-12">
              <div class="spinner mx-auto mb-4" style="width: 2rem; height: 2rem;"></div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Evaluating Your Speaking</h3>
              <p class="text-gray-600">Our AI is analyzing your responses. This may take a few moments...</p>
            </div>

            <!-- Speaking Results (similar structure to writing results) -->
            <div *ngIf="testResult && !isSubmitting" class="space-y-6">
              <!-- Similar result display as writing but with speaking-specific criteria -->
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <span class="text-3xl font-bold text-green-600">{{ testResult.overallScore }}</span>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Band Score: {{ testResult.overallScore }}/9</h3>
                <p class="text-gray-600">{{ getBandDescription(testResult.overallScore) }}</p>
              </div>

              <!-- Speaking-specific detailed scores -->
              <div class="grid md:grid-cols-2 gap-4" *ngIf="testResult.detailedScores">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="text-2xl font-bold text-blue-600 mb-1">
                      {{ testResult.detailedScores.fluency || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">Fluency & Coherence</div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body text-center">
                    <div class="text-2xl font-bold text-green-600 mb-1">
                      {{ testResult.detailedScores.lexicalResource || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">Lexical Resource</div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body text-center">
                    <div class="text-2xl font-bold text-purple-600 mb-1">
                      {{ testResult.detailedScores.grammaticalRange || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">Grammar & Accuracy</div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body text-center">
                    <div class="text-2xl font-bold text-orange-600 mb-1">
                      {{ testResult.detailedScores.pronunciation || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">Pronunciation</div>
                  </div>
                </div>
              </div>

              <!-- Rest of the feedback display (same as writing) -->
              <div class="card">
                <div class="card-header">
                  <h4 class="font-semibold text-gray-900">Detailed Feedback</h4>
                </div>
                <div class="card-body">
                  <p class="text-gray-700 mb-4">{{ testResult.feedback }}</p>
                  
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 class="font-semibold text-green-700 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Strengths
                      </h5>
                      <ul class="space-y-2">
                        <li *ngFor="let strength of testResult.strengths" 
                            class="text-sm text-gray-700 flex items-start">
                          <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {{ strength }}
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 class="font-semibold text-orange-700 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Areas for Improvement
                      </h5>
                      <ul class="space-y-2">
                        <li *ngFor="let improvement of testResult.improvements" 
                            class="text-sm text-gray-700 flex items-start">
                          <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {{ improvement }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center space-x-4">
                <button (click)="resetTest()" class="btn btn-secondary">
                  Try Again
                </button>
                <a routerLink="/ielts/results" class="btn btn-primary">
                  View All Results
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Sections (Listening, Reading) - Coming Soon -->
        <div *ngIf="currentSection === 'listening' || currentSection === 'reading'" class="card">
          <div class="card-body text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ currentSection | titlecase }} Practice Coming Soon
            </h3>
            <p class="text-gray-600 mb-6">
              We're working hard to bring you comprehensive {{ currentSection }} practice tests with AI evaluation.
            </p>
            <a routerLink="/ielts" class="btn btn-primary">
              Back to IELTS Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PracticeComponent implements OnInit {
  currentSection: string = '';
  selectedTask: number = 1;
  writingForm: FormGroup;
  wordCount: number = 0;
  timeElapsed: number = 0;
  timer: any;
  isSubmitting: boolean = false;
  testResult: IeltsTestResult | null = null;

  // Speaking practice data
  speakingQuestions: string[] = [
    "Let's talk about your hometown. Where are you from?",
    "What do you like most about your hometown?",
    "How has your hometown changed in recent years?",
    "Now let's discuss education. Do you think education is important? Why?",
    "What changes would you like to see in the education system in your country?"
  ];
  speakingResponses: string[] = ['', '', '', '', ''];

  // Writing tasks
  writingTasks = {
    1: {
      instruction: "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      timeLimit: 20
    },
    2: {
      instruction: "Some people believe that studying abroad is beneficial for students, while others think it is better to study in their home country. Discuss both views and give your own opinion. Write at least 250 words.",
      timeLimit: 40
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ieltsService: IeltsService
  ) {
    this.writingForm = this.fb.group({
      writingText: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentSection = params['section'];
      this.startTimer();
    });
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startTimer() {
    this.timeElapsed = 0;
    this.timer = setInterval(() => {
      this.timeElapsed++;
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getSectionDescription(): string {
    const descriptions = {
      listening: 'Practice with audio recordings and improve your listening comprehension skills.',
      reading: 'Enhance your reading skills with various text types and question formats.',
      writing: 'Get AI-powered feedback on your writing tasks and improve your band score.',
      speaking: 'Practice speaking questions and receive detailed feedback on your responses.'
    };
    return descriptions[this.currentSection as keyof typeof descriptions] || '';
  }

  getTaskInstructions(): string {
    return this.writingTasks[this.selectedTask as keyof typeof this.writingTasks]?.instruction || '';
  }

  updateWordCount() {
    const text = this.writingForm.get('writingText')?.value || '';
    this.wordCount = text.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
  }

  getBandDescription(score: number): string {
    const descriptions = {
      9: 'Expert User - Has fully operational command of the language',
      8: 'Very Good User - Has fully operational command with occasional inaccuracies',
      7: 'Good User - Has operational command with occasional inaccuracies',
      6: 'Competent User - Has generally effective command despite inaccuracies',
      5: 'Modest User - Has partial command with frequent problems',
      4: 'Limited User - Basic competence limited to familiar situations',
      3: 'Extremely Limited User - Conveys general meaning in familiar situations',
      2: 'Intermittent User - No real communication except basic information',
      1: 'Non User - No ability to use the language'
    };
    
    const roundedScore = Math.round(score);
    return descriptions[roundedScore as keyof typeof descriptions] || 'Score not available';
  }

  submitWritingTest() {
    if (this.writingForm.valid && this.wordCount >= (this.selectedTask === 1 ? 150 : 250)) {
      this.isSubmitting = true;
      
      const submission: WritingSubmission = {
        task: this.getTaskInstructions(),
        writingText: this.writingForm.get('writingText')?.value,
        timeSpent: this.timeElapsed,
        taskType: this.selectedTask === 1 ? 'task1' : 'task2'
      };

      this.ieltsService.submitWritingTest(submission).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.testResult = response.testResult;
          if (this.timer) {
            clearInterval(this.timer);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting writing test:', error);
          // Handle error - show user-friendly message
        }
      });
    }
  }

  submitSpeakingTest() {
    if (this.canSubmitSpeaking()) {
      this.isSubmitting = true;
      
      const submission: SpeakingSubmission = {
        questions: this.speakingQuestions,
        responses: this.speakingResponses,
        timeSpent: this.timeElapsed
      };

      this.ieltsService.submitSpeakingTest(submission).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.testResult = response.testResult;
          if (this.timer) {
            clearInterval(this.timer);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting speaking test:', error);
          // Handle error - show user-friendly message
        }
      });
    }
  }

  canSubmitSpeaking(): boolean {
    return this.speakingResponses.every(response => response.trim().length > 10);
  }

  resetTest() {
    this.testResult = null;
    this.isSubmitting = false;
    this.writingForm.reset();
    this.speakingResponses = ['', '', '', '', ''];
    this.wordCount = 0;
    this.startTimer();
  }
}