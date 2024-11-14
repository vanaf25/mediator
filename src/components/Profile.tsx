import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { getMediatorById, updateMediatorProfile } from '../firebase/firestore';
import { useEffect, useState } from "react";
import { Mediator } from "../types.ts";
import InputWithElements from "./InputWithElements.tsx";

const profileSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  fullName: z.string().min(2, 'Full name is required'),
  expertise: z.string().optional(),
  email:z.string().email(),
  experience: z.string().optional(),
  technology: z.string().optional(),
  education: z.string().optional(),
  licenses: z.string().optional(),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  missionStatement:z.string().optional(),
  hourlyRate:z.string().optional()
});
 export enum MediatorKeys {
  Expertise = "expertise",
  Education = "education",
  Licenses = "licenses",
  Services = "services",
  Testimonials="testimonials",
   Languages="languages",
  Certifications="certifications"
}
type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [mediator, setMediator] = useState<Mediator | null>(null);
  const [loading, setLoading] = useState(true);
  const [arrayData,setArrayData]=useState<{
    name:MediatorKeys,items:string[]}[]>([
    {name: MediatorKeys.Expertise, "items": []},
    {name: MediatorKeys.Education, "items": []},
    {name: MediatorKeys.Licenses, "items": []},
    {name: MediatorKeys.Services, "items": []},
    {name: MediatorKeys.Testimonials, "items": []},
    {name: MediatorKeys.Languages, "items": []},
    {name: MediatorKeys.Certifications, "items": []}
  ]);
  useEffect(() => {
    const fetchMediator = async () => {
      if (user) {
        try {
          const mediatorData = await getMediatorById(user.uid);
          if (mediatorData) {
            setMediator(mediatorData);
            console.log('m:',mediatorData)
            const defaultValues = Object.fromEntries(
                Object.entries(mediatorData).map(([key, value]) => [
                  key,
                  Array.isArray(value) ? value[0] : value,
                ])
            );
            if(mediatorData) {
              const newArray=[
                {name: MediatorKeys.Expertise, "items": mediatorData.expertise},
                {name: MediatorKeys.Education, "items": mediatorData.education},
                {name: MediatorKeys.Licenses, "items": mediatorData.licenses},
                {name: MediatorKeys.Services, "items": mediatorData.services},
                {name: MediatorKeys.Testimonials, "items": mediatorData.testimonials},
                {name: MediatorKeys.Languages, "items": mediatorData.languages},
                {name: MediatorKeys.Certifications, "items": mediatorData.certifications}
              ].map(el=>{
                if(!el.items) return {...el,items: []}
                return el
              });
              // @ts-ignore
              setArrayData(newArray)
            }
            reset(defaultValues);
          } else {
            setError('Profile not found');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to load profile');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMediator();
  }, [user, reset]);
  console.log('mediator:',mediator);
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    try {
      const obj={}
      arrayData.forEach(el=>{
        // @ts-ignore
        obj[el.name]=el.items
      })
      // @ts-ignore
      await updateMediatorProfile(user.uid, {...data,...obj});
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  const addItemHandle=(key:MediatorKeys,newItem:string)=>{
    setArrayData(prevState =>prevState.map(el=>{
      if(el.name===key){
        return {...el,items:[...el.items,newItem]}
      }
      return el
    }))
  }
  const removeItem=(key:MediatorKeys,index:number)=>{
    setArrayData(prevState =>
        prevState.map(el=>{
      if(el.name===key){
        return {...el,items:el.items.filter((_,index2)=>index2!==index)}
      }
      return el
    }))
  }
  if (loading) return <div>Loading...</div>;
  if(error) return <p>{error}</p>
  return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mediator Profile</h1>

        <form onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }} onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">


          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
                type="tel"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
                type="text"
                {...register('fullName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
          </div>

          {/* Optional fields */}
          {/*<div>
            <label className="block text-sm font-medium text-gray-700">Primary Area of Expertise</label>
            <input
                type="text"
                {...register('expertise')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.expertise && <p className="mt-1 text-sm text-red-600">{errors.expertise.message}</p>}
          </div>*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
            <input
                type="text"
                {...register('hourlyRate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
                type="number"
                {...register('experience')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Technology Proficiency</label>
            <textarea
                {...register('technology')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
            />
            {errors.technology && <p className="mt-1 text-sm text-red-600">{errors.technology.message}</p>}
          </div>
          {arrayData.map(el => <InputWithElements elements={el.items}
                                                  name={el.name}
                                                  removeItem={(index) => removeItem(el.name, index)}
                                                  addItem={(value) => addItemHandle(el.name, value)}/>)}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mission statement</label>
            <input
                type="text"
                {...register('missionStatement')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>
          {/* State and City (Required) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                  type="text"
                  {...register('state')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                  type="text"
                  {...register('city')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
            </div>
          </div>

          <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
               hover:bg-blue-700 transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
  );
}
