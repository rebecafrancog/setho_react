import {mockAccounts} from './auth';
import type {SethoDatabase} from './models/setho';
import {createRepository} from './services/repository';
export const categories=['Educação','Crianças','Idosos','Animais','Saúde','Meio ambiente','Assistência social','Outras'];
export const seed: SethoDatabase={
 orgs:[
 {id:'vida',name:'Instituto Vida Nova',city:'João Pessoa',district:'Mangabeira',category:'Educação',description:'A educação abre caminhos. Oferecemos reforço escolar, cultura e acolhimento para crianças e adolescentes.',mission:'Promover educação e oportunidades para um futuro melhor.',history:'Desde 2012, construímos novas possibilidades com famílias da nossa comunidade.',image:'/setho.jpeg'},
 {id:'raizes',name:'Raízes do Futuro',city:'Cabedelo',district:'Centro',category:'Meio ambiente',description:'Cuidamos da natureza com hortas comunitárias, educação ambiental e mutirões de plantio.',mission:'Cultivar uma relação de cuidado com o planeta.',history:'Uma iniciativa comunitária que nasceu em 2018.',image:'/setho.jpeg'},
 {id:'amor',name:'Amor em Ação',city:'Santa Rita',district:'Centro',category:'Assistência social',description:'Alimentos, acolhimento e dignidade para famílias que precisam de apoio.',mission:'Garantir cuidado e acesso a oportunidades.',history:'Há dez anos conectando solidariedade e comunidade.',image:'/setho.jpeg'},
 {id:'patas',name:'Amigos de Quatro Patas',city:'João Pessoa',district:'Bancários',category:'Animais',description:'Resgate, cuidado e adoção responsável de animais.',mission:'Dar a cada animal um lar seguro.',history:'Voluntários unidos pelo cuidado animal desde 2020.',image:'/setho.jpeg'}],
 needs:[{id:'n1',org:'vida',title:'Material escolar',description:'Precisamos de cadernos, lápis e mochilas para 80 crianças.',goal:3000,raised:1800,deadline:'2026-12-20',category:'Educação',status:'Ativo',image:'/setho.jpeg'}],
 projects:[{id:'p1',org:'vida',title:'Aprender para crescer',description:'Um espaço de leitura e aprendizado para a comunidade.',objective:'Atender 120 crianças com atividades no contraturno escolar.',audience:'Crianças de 6 a 14 anos',goal:15000,raised:6750,deadline:'2026-12-30',status:'Ativo',image:'/setho.jpeg'}],
 opportunities:[{id:'v1',org:'vida',title:'Compartilhe conhecimento',description:'Ajude crianças com leitura e atividades escolares. Cada hora de atenção faz a diferença.',category:'Educação',date:'2026-10-17',time:'09:00',location:'Sede do Instituto Vida Nova',slots:12,requirements:'Ter 18 anos ou mais e gostar de ensinar.',status:'Ativo'}, {id:'v2',org:'raizes',title:'Mutirão de plantio',description:'Vamos plantar mudas e cuidar da nossa horta comunitária.',category:'Meio ambiente',date:'2026-10-24',time:'08:00',location:'Horta comunitária de Cabedelo',slots:20,requirements:'Levar água e usar calçado fechado.',status:'Ativo'}],
 donations:[], registrations:[], accounts:mockAccounts, session:null, notifications:[],favorites:[]
};

export const repository=createRepository(seed);
