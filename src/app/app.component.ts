import { Component, OnInit } from '@angular/core'; // Import OnInit //new npm i
import { PokemonService } from './service/pokemon.service';

const COLORS = {
  Psychic: '#f8a5c2',
  Fighting: '#f0932b',
  Fairy: '#c44569',
  Normal: '#f6e58d',
  Grass: '#badc58',
  Metal: '#95afc0',
  Water: '#3dc1d3',
  Lightning: '#f9ca24',
  Darkness: '#574b90',
  Colorless: '#FFF',
  Fire: '#eb4d4b',
};

interface Pokemon {
  id: string;
  name: string;
  types: string[]; // เป็น array ของ string
  hp?: string;
  attacks?: any[];
  weaknesses?: { type: string; value: string }[]; // ปรับให้ตรงกับ JSON
  imageUrl: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // Implement OnInit
  isModalOpen = false;
  searchText = '';
  pokemonList: Pokemon[] = [];
  allPokemonList: Pokemon[] = []; // เก็บรายการ Pokemon ทั้งหมด
  mainPokemonList: Pokemon[] = []; // รายการ Pokemon สำหรับหน้าหลัก

  public COLORS = COLORS;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadAllPokemon(); // โหลดข้อมูลทั้งหมดเมื่อ Component เริ่มทำงาน
  }

  loadAllPokemon() {
    this.pokemonService.getPokemonList(1000).subscribe({
      // หรือจำนวนที่เหมาะสมกับข้อมูลทั้งหมด
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.allPokemonList = res.map((p: any) => ({
            ...p,
            types: p.types ? p.types : p.type ? [p.type] : [],
          }));
          this.pokemonList = [...this.allPokemonList]; // แสดงทั้งหมดเริ่มต้น
        } else {
          this.allPokemonList = [];
          this.pokemonList = [];
        }
      },
      error: (err) => {
        this.allPokemonList = [];
        this.pokemonList = [];
      },
    });
  }

  OpenModal() {
    this.isModalOpen = true;
  }

  CloseModal() {
    this.isModalOpen = false;
    this.searchText = '';
    this.pokemonList = [...this.allPokemonList]; // รีเซ็ตให้แสดงทั้งหมด
  }

  searchPokemon() {
    const searchTerm = this.searchText.trim().toLowerCase();
    if (!searchTerm) {
      this.pokemonList = [...this.allPokemonList]; // ถ้าไม่มีคำค้นหา ให้แสดงทั้งหมด
      return;
    }

    this.pokemonList = this.allPokemonList.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm) ||
        (pokemon.types &&
          pokemon.types.some((type) => type.toLowerCase().includes(searchTerm)))
    );
  }

  addToMainList(pokemon: Pokemon) {
    this.mainPokemonList.push(pokemon);
    this.pokemonList = this.pokemonList.filter((p) => p.id !== pokemon.id); // ลบจากรายการค้นหา
  }

  getStrength(p: Pokemon): number {
    if (p.attacks && Array.isArray(p.attacks)) {
      const length = p.attacks.length;
      return Math.min(length * 50, 100);
    }
    return 0;
  }

  getWeakness(p: Pokemon): number {
    if (p.weaknesses && Array.isArray(p.weaknesses)) {
      const length = p.weaknesses.length;
      return Math.min(length * 100, 100);
    }
    return 0;
  }

  gethp(p: Pokemon): number {
    let rawHp = (p.hp || '').replace(/[^\d]/g, ''); // กรองให้เหลือเฉพาะตัวเลข
    let hp = Number(rawHp);
    if (isNaN(hp)) {
      return 0;
    }
    return Math.min(100, Math.max(0, hp)); // ปรับให้ไม่เกิน 100 และไม่ต่ำกว่า 0
  }

  getDamage(p: Pokemon): number {
    let totalDamage = 0;
    if (p.attacks && Array.isArray(p.attacks)) {
      p.attacks.forEach((attack) => {
        const damageStr = attack.damage || '';
        const damageValue = parseInt(damageStr.replace(/[^\d]/g, ''), 10);
        totalDamage += isNaN(damageValue) ? 0 : damageValue;
      });
    }
    return totalDamage;
  }

  gethappiness(pokemon: Pokemon): number {
    const hp = this.gethp(pokemon);
    const damage = this.getDamage(pokemon);
    const weakness = this.getWeakness(pokemon);

    const happiness = (hp / 10 + damage / 10 + 10 - weakness / 100) / 5;
    const value = Math.max(0, Math.round(happiness));
    return isNaN(value) ? 0 : value;
  }

  isColorType(type: string): type is keyof typeof COLORS {
    return Object.keys(COLORS).includes(type);
  }

  getColor(type: string): string {
    if (this.isColorType(type)) {
      return COLORS[type];
    }
    return 'gray'; // default color
  }
}
