import { Component, OnInit } from '@angular/core';

type SortKey = 'popular' | 'rating' | 'new' | 'priceAsc' | 'priceDesc';

  
@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  selectedCategory: string = 'All Categories';
  selectedLevel: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced' = 'All Levels';
  selectedSort: SortKey = 'popular';
  searchTerm = '';

  courses: any[] = [];
  viewCourses: any[] = [];

  ngOnInit(): void {
    this.courses = this.mockCourses();
    this.applyFiltersAndSort();
  }

  onCategoryChange(value: any) {
    this.selectedCategory = value;
    this.applyFiltersAndSort();
  }

  onLevelChange(value: any) {
   // this.selectedLevel = (value as any) === 'All Levels' ? 'All Levels' : value;
    this.applyFiltersAndSort();
  }

  onSortChange(value: any) {
    this.selectedSort = value as SortKey;
    this.applyFiltersAndSort();
  }

  onSearch(term: any) {
    this.searchTerm = term;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort() {
    const term = this.searchTerm.trim().toLowerCase();

    let list = this.courses.filter(c => {
      const matchesCategory =
        this.selectedCategory === 'All Categories' ||
        c.category.toLowerCase() === this.selectedCategory.toLowerCase();

      const matchesLevel =
        this.selectedLevel === 'All Levels' || c.level === this.selectedLevel;

      const matchesTerm =
        !term ||
        c.title.toLowerCase().includes(term) ||
        c.instructor.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term);

      return matchesCategory && matchesLevel && matchesTerm;
    });

    switch (this.selectedSort) {
      case 'rating':
        list = list.slice().sort((a, b) => b.rating - a.rating || b.ratingsCount - a.ratingsCount);
        break;
      case 'new':
        list = list.slice().sort((a, b) => b.price - a.price); // placeholder for createdAt
        break;
      case 'priceAsc':
        list = list.slice().sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        list = list.slice().sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        list = list.slice().sort((a, b) => b.rating - a.rating || b.ratingsCount - a.ratingsCount);
        break;
    }

    this.viewCourses = list;
  }

  private mockCourses(): any[] {
    return [
      {
        id: 'chem-101',
        title: 'Chemistry 101: Foundations',
        instructor: 'Dr. A. Bose',
        imageUrl: 'https://images.unsplash.com/photo-1559757175-08eecf7b5d32?q=80&w=1200&auto=format',
        category: 'Science',
        level: 'Beginner',
        duration: '10h 20m',
        shortDescription: 'Core concepts of atoms, molecules, bonding, and reactions with simple labs.',
        price: 1499,
        originalPrice: 1999,
        rating: 4.7,
        ratingsCount: 1289,
        badge: 'Bestseller'
      },
      {
        id: 'phys-fund',
        title: 'Physics Fundamentals',
        instructor: 'Prof. R. Sen',
        imageUrl: 'https://images.unsplash.com/photo-1536305030431-0998b92ae2a0?q=80&w=1200&auto=format',
        category: 'Science',
        level: 'Intermediate',
        duration: '14h 05m',
        shortDescription: 'Kinematics, dynamics, energy, and momentum with problem-solving drills.',
        price: 1299,
        rating: 4.6,
        ratingsCount: 932,
        badge: 'New'
      },
      {
        id: 'algebra-pro',
        title: 'Algebra Pro: From Linear to Quadratic',
        instructor: 'Ms. T. Gupta',
        imageUrl: 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1200&auto=format',
        category: 'Math',
        level: 'Beginner',
        duration: '12h 45m',
        shortDescription: 'Build algebra mastery with step-by-step methods and real exam questions.',
        price: 999,
        rating: 4.5,
        ratingsCount: 2104
      },
      {
        id: 'stats-intro',
        title: 'Statistics Intro with Projects',
        instructor: 'Dr. P. Khan',
        imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format',
        category: 'Math',
        level: 'Advanced',
        duration: '9h 10m',
        shortDescription: 'Descriptive stats, probability, and inference with mini capstone tasks.',
        price: 1799,
        originalPrice: 1999,
        rating: 4.8,
        ratingsCount: 1570
      },
      {
        id: 'spoken-eng',
        title: 'Spoken English: Practical Fluency',
        instructor: 'Mr. J. Dutta',
        imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format',
        category: 'Languages',
        level: 'Beginner',
        duration: '8h 30m',
        shortDescription: 'Daily speaking drills, pronunciation tips, and role-plays to boost confidence.',
        price: 899,
        rating: 4.4,
        ratingsCount: 740
      },
      {
        id: 'geo-visual',
        title: 'Geometry with Visual Intuition',
        instructor: 'Ms. R. Nair',
        imageUrl: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format',
        category: 'Math',
        level: 'Intermediate',
        duration: '11h 00m',
        shortDescription: 'Triangles to circles with visual proofs and interactive constructions.',
        price: 1199,
        rating: 4.6,
        ratingsCount: 865
      }
    ];
  }
}
